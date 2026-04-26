/**
 * Database seeder for local development.
 * Completely resets the database and populates it with a test user,
 * checklist templates, and sample inspection records.
 *
 * Usage:
 *   npm run seed                         (inside backend/ or inside the backend container)
 *   docker compose exec backend npm run seed
 *
 * Login after seeding:
 *   Email:    test@local.dev
 *   Password: Test1234!
 */

const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env.local") })

const mongoose = require("mongoose")
const Plant = require("./models/Plant")
const CheckGroup = require("./models/CheckGroup")
const CheckList = require("./models/CheckList")
const User = require("./models/User")
const Record = require("./models/Record")

const MONGO_URI = process.env.ATLAS_URI || "mongodb://mongo:27017/vehicle-checklist"

function daysAgo(n) {
    return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
}

function buildCheckedGroups(groups, failOverrides = {}) {
    return groups.map((group) => ({
        group_id: group._id,
        checks: group.checks.map((check) => {
            const override = failOverrides[check.code]
            if (override) return { code: check.code, passed: false, note: override }
            return { code: check.code, passed: true }
        })
    }))
}

async function seed() {
    if (process.env.NODE_ENV === "production") {
        console.error("Refusing to run seeder with NODE_ENV=production")
        process.exit(1)
    }

    // Guard against accidentally wiping a remote/production database.
    const parsedUrl = new URL(MONGO_URI.replace("mongodb+srv://", "https://").replace("mongodb://", "http://"))
    const allowedHosts = new Set(["mongo", "localhost", "127.0.0.1", "::1"])
    if (!allowedHosts.has(parsedUrl.hostname)) {
        console.error(`Refusing to seed non-local host: ${parsedUrl.hostname}`)
        console.error("Set ATLAS_URI to a local mongo instance, or unset it to use the Docker default.")
        process.exit(1)
    }

    console.log(`\nConnecting to MongoDB: ${MONGO_URI}`)
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    console.log("Connected.\n")

    // ── Reset ──────────────────────────────────────────────────────────────────
    console.log("Dropping database...")
    await mongoose.connection.dropDatabase()

    // ── Plants ─────────────────────────────────────────────────────────────────
    console.log("Seeding plant...")
    const plant = await new Plant({ name: "Depot A" }).save()

    // ── Check groups ───────────────────────────────────────────────────────────
    console.log("Seeding check groups...")
    const [engineGroup, lightsGroup, safetyGroup, tyresGroup] = await CheckGroup.insertMany([
        {
            name: "Engine & Fluids",
            checks: [
                { code: "EF01", title: "Engine oil level satisfactory" },
                { code: "EF02", title: "Coolant level satisfactory" },
                { code: "EF03", title: "Brake fluid level satisfactory" },
                { code: "EF04", title: "Power steering fluid satisfactory" }
            ]
        },
        {
            name: "Lights & Signals",
            checks: [
                { code: "LS01", title: "Headlights working" },
                { code: "LS02", title: "Tail lights working" },
                { code: "LS03", title: "Indicators (nearside) working" },
                { code: "LS04", title: "Indicators (offside) working" },
                { code: "LS05", title: "Hazard lights working" }
            ]
        },
        {
            name: "Safety Equipment",
            checks: [
                { code: "SE01", title: "First aid kit present and in date" },
                { code: "SE02", title: "Fire extinguisher present and charged" },
                { code: "SE03", title: "Warning triangle present" },
                { code: "SE04", title: "Hi-vis vest present" }
            ]
        },
        {
            name: "Tyres & Wheels",
            checks: [
                { code: "TW01", title: "Front offside tyre condition satisfactory" },
                { code: "TW02", title: "Front nearside tyre condition satisfactory" },
                { code: "TW03", title: "Rear offside tyres condition satisfactory" },
                { code: "TW04", title: "Rear nearside tyres condition satisfactory" },
                { code: "TW05", title: "Wheel nuts secure" }
            ]
        }
    ])

    // ── Checklist ──────────────────────────────────────────────────────────────
    console.log("Seeding checklist...")
    const checklist = await new CheckList({
        name: "HGV Daily Walkaround",
        required_checks: [
            { check_group_id: engineGroup._id },
            { check_group_id: lightsGroup._id },
            { check_group_id: safetyGroup._id },
            { check_group_id: tyresGroup._id }
        ]
    }).save()

    // ── Test user ──────────────────────────────────────────────────────────────
    console.log("Seeding user (password will be hashed)...")
    const user = await new User({
        first_name: "Test",
        last_name: "Driver",
        email: "test@local.dev",
        password: "Test1234!",
        plant_id: plant._id,
        vehicle: {
            registration_number: "TE57 TDR",
            make: "Volvo",
            model: "FH16",
            check_list_id: checklist._id
        }
    }).save()

    // ── Records ────────────────────────────────────────────────────────────────
    console.log("Seeding inspection records...")
    const allGroups = [engineGroup, lightsGroup, safetyGroup, tyresGroup]
    const regNumber = user.vehicle.registration_number
    const plantName = plant.name

    await Record.insertMany([
        // 14 days ago — all checks passed
        {
            checked_groups: buildCheckedGroups(allGroups),
            date: daysAgo(14),
            registration_number: regNumber,
            plant_name: plantName,
            user_id: user._id,
            passed: true,
            check_list_id: checklist._id
        },
        // 7 days ago — two defects found
        {
            checked_groups: buildCheckedGroups(allGroups, {
                EF01: "Oil low — topped up before departure",
                LS03: "Nearside indicator bulb blown — reported to workshop"
            }),
            date: daysAgo(7),
            registration_number: regNumber,
            plant_name: plantName,
            user_id: user._id,
            passed: false,
            check_list_id: checklist._id
        },
        // Yesterday — all checks passed
        {
            checked_groups: buildCheckedGroups(allGroups),
            date: daysAgo(1),
            registration_number: regNumber,
            plant_name: plantName,
            user_id: user._id,
            passed: true,
            check_list_id: checklist._id
        }
    ])

    console.log("\n✅ Seed complete!")
    console.log("─────────────────────────────────")
    console.log("  Plant:      Depot A")
    console.log("  Checklist:  HGV Daily Walkaround (4 groups, 18 checks)")
    console.log("  User email: test@local.dev")
    console.log("  Password:   Test1234!")
    console.log("  Records:    3 (2 passed, 1 failed)")
    console.log("─────────────────────────────────\n")

    await mongoose.disconnect()
    process.exit(0)
}

seed().catch((err) => {
    console.error("\n❌ Seed failed:", err.message)
    process.exit(1)
})
