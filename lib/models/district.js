import mongoose from "mongoose";

const DistrictSchema = new mongoose.Schema(
  {
    district_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    district_slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    state_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // for fast filtering by state
    },
    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },
    census_year: {
      type: Number,
      required: true,
    },

    // Administrative divisions
    total_tehsils: { type: Number, default: 0 },
    total_blocks: { type: Number, default: 0 },
    total_villages: { type: Number, default: 0 },

    // Population
    total_population: { type: Number, default: 0 },
    male_population: { type: Number, default: 0 },
    female_population: { type: Number, default: 0 },
    sc_population: { type: Number, default: 0 },
    st_population: { type: Number, default: 0 },
    total_households: { type: Number, default: 0 },

    // Literacy rates
    avg_literacy_rate: { type: Number, default: 0 },
    avg_male_literacy: { type: Number, default: 0 },
    avg_female_literacy: { type: Number, default: 0 },

    // Location & Infrastructure
    nearest_city: { type: String, trim: true, default: null },
    nearest_railway_station: { type: String, trim: true, default: null },
    nearest_airport: { type: String, trim: true, default: null },
    roads: { type: String, trim: true, default: null },

    // Agriculture & Economy
    major_crops: { type: String, trim: true, default: null },
    main_occupation: { type: String, trim: true, default: null },

    // Healthcare
    primary_health_center: { type: Number, default: 0 },
    district_hospital: { type: Number, default: null },

    // SEO/CMS fields
    post_title: { type: String, trim: true, default: null },
    post_name: { type: String, trim: true, default: null },
    state_1: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
  },
);

// Indexes for common queries
DistrictSchema.index({ district: 1 });
DistrictSchema.index({ district_slug: 1 });
DistrictSchema.index({ state_slug: 1, district_slug: 1 }); // compound index for state+district lookups

const District =
  mongoose.models.District || mongoose.model("District", DistrictSchema);

export default District;
