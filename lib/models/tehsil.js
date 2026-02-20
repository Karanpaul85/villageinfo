import mongoose from "mongoose";

const TehsilSchema = new mongoose.Schema(
  {
    block_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    block_tehsil: {
      type: String,
      required: true,
      trim: true,
    },
    block_slug: {
      type: String,
      required: true,
      lowercase: true,
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
      lowercase: true,
      trim: true,
      index: true,
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
      index: true,
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

    // Administrative
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

    // Location
    headquarter_town: { type: String, trim: true, default: null },
    nearest_city: { type: String, trim: true, default: null },
    pin_code: { type: Number, default: null },
    nearest_railway_station: { type: String, trim: true, default: null },
    nearest_airport: { type: String, trim: true, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    // Infrastructure (percentages for internet, mobile_networks)
    roads: { type: String, trim: true, default: null },
    internet: { type: Number, default: null }, // percentage
    mobile_networks: { type: Number, default: null }, // percentage
    drinking_water: { type: String, trim: true, default: null },

    // Agriculture & Economy
    major_crops: { type: String, trim: true, default: null },
    main_occupation: { type: String, trim: true, default: null },

    // Healthcare
    primary_health_center: { type: Number, default: 0 },
    district_hospital: { type: Number, default: null },
  },
  {
    timestamps: true,
  },
);

// Indexes for common queries
TehsilSchema.index({ block_slug: 1 });
TehsilSchema.index({ state_slug: 1, district_slug: 1 }); // state + district lookup
TehsilSchema.index({ state_slug: 1, district_slug: 1, block_slug: 1 }); // full hierarchy lookup

const Tehsil = mongoose.models.Tehsil || mongoose.model("Tehsil", TehsilSchema);

export default Tehsil;
