import { supabase } from "./supabaseClient";

/**
 * ============================================
 * STUDENTS TABLE OPERATIONS
 * ============================================
 */

export const studentsDB = {
  // Get all students
  async getAll() {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get student by school ID
  async getBySchoolId(schoolId) {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("school_id", schoolId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    return data;
  },

  // Create new student
  async create(studentData) {
    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          school_id: studentData.schoolId,
          first_name: studentData.firstName,
          last_name: studentData.lastName,
          middle_initial: studentData.middleInitial || "",
          full_name: studentData.fullName,
          photo: studentData.photo || "",
          fingerprint: studentData.fingerprint,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update student
  async update(schoolId, updates) {
    const { data, error } = await supabase
      .from("students")
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        middle_initial: updates.middleInitial || "",
        full_name: updates.fullName,
        photo: updates.photo,
        fingerprint: updates.fingerprint,
        updated_at: new Date().toISOString(),
      })
      .eq("school_id", schoolId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete student
  async delete(schoolId) {
    console.log("🗑️ Attempting to delete student:", schoolId);
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("school_id", schoolId);

    if (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }
    console.log("✅ Student deleted successfully");
    return true;
  },

  // Mark student as voted
  async markVoted(schoolId) {
    const { data, error } = await supabase
      .from("students")
      .update({
        has_voted: true,
        voting_status: "completed",
        voted_at: new Date().toISOString(),
      })
      .eq("school_id", schoolId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

/**
 * ============================================
 * PARTY LISTS TABLE OPERATIONS
 * ============================================
 */

export const partyListsDB = {
  // Get all party lists
  async getAll() {
    const { data, error } = await supabase
      .from("party_lists")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data.map((p) => p.name); // Return array of names for compatibility
  },

  // Create new party list
  async create(partyName) {
    const { data, error } = await supabase
      .from("party_lists")
      .insert([{ name: partyName }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete party list
  async delete(partyName) {
    const { error } = await supabase
      .from("party_lists")
      .delete()
      .eq("name", partyName);

    if (error) throw error;
    return true;
  },

  // Get party list ID by name
  async getIdByName(partyName) {
    const { data, error } = await supabase
      .from("party_lists")
      .select("id")
      .eq("name", partyName)
      .single();

    if (error) throw error;
    return data.id;
  },
};

/**
 * ============================================
 * CANDIDATES TABLE OPERATIONS
 * ============================================
 */

export const candidatesDB = {
  // Get all candidates with details
  async getAll() {
    const { data, error } = await supabase
      .from("candidates")
      .select(
        `
        *,
        student:students!candidates_student_id_fkey (
          photo
        ),
        party:party_lists!candidates_party_list_id_fkey (
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform to match old format
    return data.map((c) => ({
      id: c.id,
      name: c.name,
      schoolId: c.school_id,
      position: c.position,
      partyList: c.party_list_name,
    }));
  },

  // Create new candidate
  async create(candidateData) {
    // First, get the student UUID
    const student = await studentsDB.getBySchoolId(candidateData.schoolId);
    if (!student) throw new Error("Student not found");

    // Get party list ID
    const partyListId = await partyListsDB.getIdByName(candidateData.partyList);

    const { data, error } = await supabase
      .from("candidates")
      .insert([
        {
          student_id: student.id,
          school_id: candidateData.schoolId,
          name: candidateData.name,
          position: candidateData.position,
          party_list_id: partyListId,
          party_list_name: candidateData.partyList,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      schoolId: data.school_id,
      position: data.position,
      partyList: data.party_list_name,
    };
  },

  // Delete candidate
  async delete(candidateId) {
    const { error } = await supabase
      .from("candidates")
      .delete()
      .eq("id", candidateId);

    if (error) throw error;
    return true;
  },

  // Get candidates by position
  async getByPosition(position) {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("position", position);

    if (error) throw error;
    return data;
  },
};

/**
 * ============================================
 * VOTES TABLE OPERATIONS
 * ============================================
 */

export const votesDB = {
  // Submit a vote
  async submit(voteData) {
    // Get student UUID
    const student = await studentsDB.getBySchoolId(voteData.studentId);
    if (!student) throw new Error("Student not found");

    // Check if already voted
    if (student.has_voted) {
      throw new Error("Student has already voted");
    }

    const { data, error } = await supabase
      .from("votes")
      .insert([
        {
          student_id: student.id,
          school_id: voteData.studentId,
          student_name: voteData.studentName,
          votes: voteData.votes,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Mark student as voted
    await studentsDB.markVoted(voteData.studentId);

    return data;
  },

  // Check if student has voted
  async hasVoted(schoolId) {
    const student = await studentsDB.getBySchoolId(schoolId);
    return student ? student.has_voted : false;
  },

  // Get all votes
  async getAll() {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get vote by student ID
  async getByStudentId(schoolId) {
    const student = await studentsDB.getBySchoolId(schoolId);
    if (!student) return null;

    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .eq("student_id", student.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    return data;
  },

  // Get vote counts (for results)
  async getCounts() {
    const { data, error } = await supabase.rpc("get_vote_counts"); // You'll need to create this RPC function

    if (error) throw error;
    return data;
  },
};

/**
 * ============================================
 * UTILITY FUNCTIONS
 * ============================================
 */

export const utils = {
  // Transform old localStorage data to new format
  transformStudentData(oldData) {
    return {
      schoolId: oldData.schoolId,
      firstName: oldData.firstName,
      lastName: oldData.lastName,
      middleInitial: oldData.middleInitial || "",
      fullName: oldData.fullName,
      photo: oldData.photo || "",
      fingerprint: oldData.fingerprint,
    };
  },

  // Handle Supabase errors
  handleError(error) {
    console.error("Supabase error:", error);

    if (error.code === "PGRST116") {
      return "Record not found";
    } else if (error.code === "23505") {
      return "This record already exists";
    } else if (error.code === "23503") {
      return "Related record not found";
    } else {
      return error.message || "An error occurred";
    }
  },
};
