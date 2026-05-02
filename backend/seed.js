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

const path = require("node:path")
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

function slugify(s) {
    return String(s)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
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
        process.exit(1)
    }

    // Guard against accidentally wiping a remote/production database.
    const parsedUrl = new URL(MONGO_URI.replace("mongodb+srv://", "https://").replace("mongodb://", "http://"))
    const allowedHosts = new Set(["mongo", "localhost", "127.0.0.1", "::1"])
    if (!allowedHosts.has(parsedUrl.hostname)) {
        process.exit(1)
    }

    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })

    // Migration: clear legacy field from any pre-existing documents before dropping
    await User.updateMany({}, { $unset: { "vehicle.check_list_id": "" } })

    await mongoose.connection.dropDatabase()

    const plant = await new Plant({ name: "Depot A" }).save()

    const [engineGroup, lightsGroup, safetyGroup, tyresGroup] = await CheckGroup.insertMany([
        {
            name: "Engine & Fluids",
            checks: [
                { title: "Engine oil level satisfactory", code: slugify("Engine oil level satisfactory") },
                { title: "Coolant level satisfactory", code: slugify("Coolant level satisfactory") },
                { title: "Brake fluid level satisfactory", code: slugify("Brake fluid level satisfactory") },
                { title: "Power steering fluid satisfactory", code: slugify("Power steering fluid satisfactory") }
            ]
        },
        {
            name: "Lights & Signals",
            checks: [
                { title: "Headlights working", code: slugify("Headlights working") },
                { title: "Tail lights working", code: slugify("Tail lights working") },
                { title: "Indicators (nearside) working", code: slugify("Indicators (nearside) working") },
                { title: "Indicators (offside) working", code: slugify("Indicators (offside) working") },
                { title: "Hazard lights working", code: slugify("Hazard lights working") }
            ]
        },
        {
            name: "Safety Equipment",
            checks: [
                { title: "First aid kit present and in date", code: slugify("First aid kit present and in date") },
                {
                    title: "Fire extinguisher present and charged",
                    code: slugify("Fire extinguisher present and charged")
                },
                { title: "Warning triangle present", code: slugify("Warning triangle present") },
                { title: "Hi-vis vest present", code: slugify("Hi-vis vest present") }
            ]
        },
        {
            name: "Tyres & Wheels",
            checks: [
                {
                    title: "Front offside tyre condition satisfactory",
                    code: slugify("Front offside tyre condition satisfactory")
                },
                {
                    title: "Front nearside tyre condition satisfactory",
                    code: slugify("Front nearside tyre condition satisfactory")
                },
                {
                    title: "Rear offside tyres condition satisfactory",
                    code: slugify("Rear offside tyres condition satisfactory")
                },
                {
                    title: "Rear nearside tyres condition satisfactory",
                    code: slugify("Rear nearside tyres condition satisfactory")
                },
                { title: "Wheel nuts secure", code: slugify("Wheel nuts secure") }
            ]
        }
    ])

    const checklist = await new CheckList({
        name: "HGV Daily Walkaround",
        required_checks: [
            { check_group_id: engineGroup._id },
            { check_group_id: lightsGroup._id },
            { check_group_id: safetyGroup._id },
            { check_group_id: tyresGroup._id }
        ]
    }).save()

    const user = await new User({
        first_name: "Test",
        last_name: "Driver",
        email: "test@local.dev",
        password: "Test1234!",
        plant_id: plant._id,
        vehicle: {
            registration_number: "TE57 TDR",
            make: "Volvo",
            model: "FH16"
        }
    }).save()

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
                "engine-oil-level-satisfactory": "Oil low — topped up before departure",
                "indicators-nearside-working": "Nearside indicator bulb blown — reported to workshop"
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

    await mongoose.disconnect()
    process.exit(0)
}

seed().catch((_err) => {
    process.exit(1)
})
