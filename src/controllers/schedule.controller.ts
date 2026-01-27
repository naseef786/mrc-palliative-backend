import { Request, Response } from "express";
import Schedule from "../models/Schedule";
import { log } from "node:console";

// CREATE
export const createSchedule = async (req: any, res: Response) => {
  log("Creating schedule with data:", req.body, "by user:", req.user.id);
  const schedule = await Schedule.create({
    ...req.body,
    createdBy: req.user.id,
    patient: req.body.patientId,
  });

  res.status(201).json(schedule);
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const search = String(req.query.q || "").trim();

    /* ================= BUILD SEARCH QUERY ================= */
    const query: any = {};

    if (search) {
      query.$or = [
        { info: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { remarks: { $regex: search, $options: "i" } },
        { otherInfo: { $regex: search, $options: "i" } },
      ];
    }
    console.log(search);

    /* ================= FETCH DATA ================= */
    const [schedules, total] = await Promise.all([
      Schedule.find(query)
        .populate({
          path: "patient",
          match: search
            ? { name: { $regex: search, $options: "i" } }
            : {},
        })
        .populate("assignedVolunteer", "name")
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Schedule.countDocuments(query),
    ]);

    /* ================= FILTER NULL PATIENTS (WHEN SEARCHING) ================= */
    const filteredSchedules = search
      ? schedules.filter((s) => s.patient !== null)
      : schedules;
    console.log({
      data: filteredSchedules,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    });

    res.json({
      data: filteredSchedules,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    });
  } catch (error) {
    console.error("Get schedules error:", error);
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
};

// UPDATE
export const updateSchedule = async (req: Request, res: Response) => {
  console.log(req?.body, req.params?.id);

  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    req.body,

    { new: true, runValidators: true }
  );

  res.json(schedule);
};

// DELETE
export const deleteSchedule = async (req: Request, res: Response) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// ASSIGN / UNASSIGN
export const assignSelf = async (req: any, res: Response) => {
  console.log(JSON?.stringify(req.params));
  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    {
      assignedVolunteer: req.user.id,
      status: "in-progress",
    },
    { new: true }
  );
  console.log("Assigned schedule:", schedule);
  res.json(schedule);
};

export const unassignSelf = async (req: Request, res: Response) => {
  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    {
      assignedVolunteer: null,
      status: "pending",
    },
    { new: true }
  );

  res.json(schedule);
};


export const getAssignedSchedules = async (req: Request, res: Response) => {
  try {
    const volunteerId = req.user?.id as string;

    if (!volunteerId) {
      return res.status(400).json({ message: "volunteerId is required" });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const query: any = {
      assignedVolunteer: volunteerId,
    };

    if (search) {
      query.info = { $regex: search, $options: "i" };
    }
    const [total, schedules] = await Promise.all([
      Schedule.countDocuments(query),

      Schedule.find(query)
        .populate({
          path: "patient",
          select: "name age gender phone address bloodGroup medicalHistory", // adjust fields
        })
        .populate({
          path: "assignedVolunteer",
          select: "name email phone role",
        })
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);


    const nextPage = total > page * limit ? page + 1 : null;

    res.json({
      data: schedules,
      pagination: {
        page,
        limit,
        total,
        nextPage,
      },
    });
  } catch (error) {
    console.error("Get Assigned Schedules Error:", error);
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
};


// PATCH /api/schedules/:id/status
export const updateScheduleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: "pending" | "in-progress" | "completed" };
    console.log(id, status, "{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}");

    const schedule = await Schedule.findById(id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    schedule.status = status;
    await schedule.save();

    res.json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update schedule status" });
  }
};



