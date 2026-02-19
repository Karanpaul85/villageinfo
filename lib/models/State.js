import mongoose from "mongoose";

const StateSchema = new mongoose.Schema(
  {
    state_id: {
      type: String,
      required: true,
      unique: true,
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
      unique: true,
      lowercase: true,
      trim: true,
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
    total_districts: { type: Number, default: 0 },
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

    // Literacy rates (percentage)
    avg_literacy_rate: { type: Number, default: 0 },
    avg_male_literacy: { type: Number, default: 0 },
    avg_female_literacy: { type: Number, default: 0 },

    // Location
    nearest_city: { type: String, trim: true, default: null },
    nearest_airport: { type: String, trim: true, default: null },

    // Agriculture & Economy
    major_crops: { type: String, trim: true, default: null },
    main_occupation: { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
  },
);

// Indexes for common queries
// Note: state_id and state_slug are already indexed via unique: true in the field definition
StateSchema.index({ state: 1 });
StateSchema.index({ country: 1 });

const State = mongoose.models.State || mongoose.model("State", StateSchema);

export default State;
