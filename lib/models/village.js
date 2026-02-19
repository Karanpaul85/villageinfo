import mongoose from "mongoose";

const VillageSchema = new mongoose.Schema(
  {
    village_id: {
      type: Number,
      required: true,
      unique: true,
    },
    village_name: {
      type: String,
      required: true,
      trim: true,
    },
    village_slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
      index: true,
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
    tehsil: {
      type: String,
      trim: true,
      default: null,
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

    // Population
    total_population: { type: Number, default: 0 },
    male_population: { type: Number, default: 0 },
    female_population: { type: Number, default: 0 },
    sex_ratio: { type: Number, default: 0 },
    child_population_0_6: { type: Number, default: 0 },
    sc_population: { type: Number, default: 0 },
    st_population: { type: Number, default: 0 },
    total_households: { type: Number, default: 0 },

    // Literacy
    avg_literacy_rate: { type: Number, default: 0 },
    male_literacy_rate: { type: Number, default: 0 },
    female_literacy_rate: { type: Number, default: 0 },

    // Location
    pin_code: { type: Number, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    // Distances
    nearest_town: { type: String, trim: true, default: null },
    distance_to_town_km: { type: Number, default: null },
    nearest_city: { type: String, trim: true, default: null },
    nearest_railway_station: { type: String, trim: true, default: null },
    railway_distance_km: { type: Number, default: null },
    nearest_airport: { type: String, trim: true, default: null },
    airport_distance_km: { type: Number, default: null },
    nearest_bus_stop: { type: String, trim: true, default: null },
    nearest_college: { type: String, trim: true, default: null },

    // Infrastructure & Facilities
    primary_school: { type: Number, default: 0 },
    middle_school: { type: Number, default: null },
    secondary_school: { type: Number, default: 0 },
    primary_health_center: { type: Number, default: 0 },
    sub_health_center: { type: Number, default: null },
    district_hospital: { type: Number, default: null },
    private_clinic: { type: Number, default: null },

    electricity: { type: Number, default: null }, // percentage
    roads: { type: String, trim: true, default: null },
    road_connectivity: { type: String, trim: true, default: null },
    drinking_water: { type: String, trim: true, default: null },
    sanitation: { type: String, trim: true, default: null },
    internet: { type: Number, default: null }, // percentage
    mobile_networks: { type: Number, default: null }, // percentage

    // Governance
    gram_panchayat: { type: String, trim: true, default: null },
    ward_count: { type: Number, default: null },

    // Geography & Climate
    terrain_geography: { type: String, trim: true, default: null },
    climate_weather: { type: String, trim: true, default: null },

    // Economy & Agriculture
    major_crops: { type: String, trim: true, default: null },
    main_occupation: { type: String, trim: true, default: null },
    livestock: { type: String, trim: true, default: null },
    local_market: { type: String, trim: true, default: null },

    // Culture
    major_religions: { type: String, trim: true, default: null },
    festivals: { type: String, trim: true, default: null },

    // Rating
    village_rating_1_5: { type: Number, min: 1, max: 5, default: null },

    // SEO/CMS
    post_title: { type: String, trim: true, default: null },
    post_name: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
  },
);

// Indexes for common queries
VillageSchema.index({ village_slug: 1 });
VillageSchema.index({ state_slug: 1 });
VillageSchema.index({ district_slug: 1 });
VillageSchema.index({ block_slug: 1 });
VillageSchema.index({ state_slug: 1, district_slug: 1 });
VillageSchema.index({ state_slug: 1, district_slug: 1, block_slug: 1 });
VillageSchema.index({
  state_slug: 1,
  district_slug: 1,
  block_slug: 1,
  village_slug: 1,
}); // full hierarchy

const Village =
  mongoose.models.Village || mongoose.model("Village", VillageSchema);

export default Village;
