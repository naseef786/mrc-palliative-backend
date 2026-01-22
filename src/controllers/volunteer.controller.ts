import User from "../models/User";

export const getVolunteers = async (req: any, res: any) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  console.log("Fetching volunteers with search:", search, "page:", page, "limit:", limit, req?.query);
  const query: any = {
    role: "volunteer",
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(query);

  const volunteers = await User.find(query)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({
    data: volunteers,
    pagination: {
      page,
      limit,
      total,
      hasMore: page * limit < total,
    },
  });
};


export const updateVolunteer = async (req: any, res: any) => {
  const volunteer = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).select("-password");

  res.json(volunteer);
};

export const deleteVolunteer = async (req: any, res: any) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
