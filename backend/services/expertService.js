import Expert from "../models/expert.js";
import User from "../models/user.js";

/**
 * Get all experts, optionally excluding a specific user
 */
export const getAllExperts = async (excludeUserId = null) => {
  let query = {};
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }
  
  const experts = await Expert.find(query).sort({ createdAt: -1 });
  return experts;
};

/**
 * Get expert by ID
 */
export const getExpertById = async (expertId) => {
  const expert = await Expert.findById(expertId);
  if (!expert) {
    throw new Error("Expert not found");
  }
  return expert;
};

/**
 * Update expert profile
 */
export const updateExpertProfile = async (expertId, updateData) => {
  const updatedExpert = await Expert.findByIdAndUpdate(
    expertId,
    {
      name: updateData.name?.trim(),
      industry: updateData.industry?.trim(),
      location: updateData.location?.trim(),
      experienceYears: updateData.experienceYears,
      description: updateData.description?.trim(),
      pricing: updateData.pricing,
      img: updateData.img,
    },
    { new: true, runValidators: true }
  );

  if (!updatedExpert) {
    throw new Error("Expert not found");
  }

  return updatedExpert;
};

/**
 * Delete expert profile and associated user
 */
export const deleteExpertProfile = async (expertId) => {
  const expert = await Expert.findById(expertId);
  if (!expert) {
    throw new Error("Expert profile not found");
  }

  // Delete expert profile
  await Expert.findByIdAndDelete(expertId);

  // Delete user account
  await User.findByIdAndDelete(expertId);

  return { expertId, imageUrl: expert.img };
};

