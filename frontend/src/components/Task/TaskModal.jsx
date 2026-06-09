import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, CheckCircle, XCircle, Send, Bot, Upload, FileText, AlertTriangle, Sparkles, UserCheck, Star, Loader2 } from "lucide-react";
import { createTask, updateTask, deleteTask, submitTask, verifyTask, autoAssignTask, confirmTask, completeTask } from '../../services/taskService';
import { getProjects } from '../../services/projectService';

const TaskModal = ({ 
  showTaskModal, 
  setShowTaskModal, 
  selectedTask, 
  setSelectedTask, 
  columns, 
  teamMembers,
  isAdmin,
  onTaskSave,
  fixedProjectId = null,
  isEventMode = false,
  defaultStatus = "Pending"
}) => {
  const navigate = useNavigate();
  const canEdit = isAdmin || (isEventMode && !selectedTask?._id);
  const fileInputRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [workDescription, setWorkDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { autoCompleted, aiEvaluation, message }
  const [autoAssignResult, setAutoAssignResult] = useState(null); // { assigned, noMatch, assignedUser, ... }

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "medium",
    dueDate: "",
    assignees: [],
    tags: [],
    requiredSkills: [],
    project: fixedProjectId || ""
  });

  // Required skills as comma-separated string for input
  const [requiredSkillsInput, setRequiredSkillsInput] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (!fixedProjectId && isAdmin) {
        try {
          const data = await getProjects();
          setProjects(data);
        } catch (err) {
          console.error("Failed to fetch projects in TaskModal:", err);
        }
      }
    };
    fetchProjects();
  }, [fixedProjectId, isAdmin, showTaskModal]);

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        status: selectedTask.status || "Pending",
        priority: selectedTask.priority || "medium",
        dueDate: selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : "",
        assignees: selectedTask.assignees || [],
        tags: selectedTask.tags || [],
        requiredSkills: selectedTask.requiredSkills || [],
        project: (typeof selectedTask.project === 'string' ? selectedTask.project : selectedTask.project?._id) || fixedProjectId || ""
      });
      setRequiredSkillsInput((selectedTask.requiredSkills || []).join(', '));
    } else {
      setFormData({
        title: "",
        description: "",
        status: defaultStatus,
        priority: "medium",
        dueDate: "",
        assignees: [],
        tags: [],
        requiredSkills: [],
        project: fixedProjectId || ""
      });
      setRequiredSkillsInput("");
    }
    setWorkDescription("");
    setSelectedFile(null);
    setSubmitResult(null);
    setAutoAssignResult(null);
  }, [selectedTask, showTaskModal, fixedProjectId, defaultStatus]);

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      alert("Please enter a task title");
      return;
    }

    const payload = {
      ...formData,
      requiredSkills: requiredSkillsInput
        ? requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean)
        : formData.requiredSkills,
      assignees: (formData.assignees || []).map(a => a._id || a)
    };

    try {
      if (selectedTask?._id) {
        await updateTask(selectedTask._id, payload);
      } else {
        await createTask(payload);
      }
      setShowTaskModal(false);
      setSelectedTask(null);
      if (onTaskSave) onTaskSave();
    } catch (error) {
      alert("Error saving task: " + error);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask?._id) return;
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(selectedTask._id);
      setShowTaskModal(false);
      setSelectedTask(null);
      if (onTaskSave) onTaskSave();
    } catch (error) {
      alert("Error deleting task: " + error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmitWork = async () => {
    if (!workDescription.trim() && !selectedFile) {
      alert("Please provide a description or upload a file.");
      return;
    }
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const result = await submitTask(selectedTask?._id, {
        description: workDescription,
        file: selectedFile
      });
      setSubmitResult(result);
      setWorkDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onTaskSave) onTaskSave();
    } catch (error) {
      alert("Error submitting work: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (status) => {
    try {
      await verifyTask(selectedTask?._id, { status, feedback: workDescription });
      setWorkDescription("");
      if (onTaskSave) onTaskSave();
    } catch (error) {
      alert("Error verifying task: " + error);
    }
  };

  const handleAutoAssign = async () => {
    if (!selectedTask?._id) {
      alert("Please save the task first before auto-assigning.");
      return;
    }
    setIsAutoAssigning(true);
    setAutoAssignResult(null);
    try {
      const result = await autoAssignTask(selectedTask._id);
      setAutoAssignResult(result);
      if (result.assigned && onTaskSave) {
        onTaskSave(); // Refresh to reflect new assignee
      }
    } catch (error) {
      alert("Auto-assign error: " + error);
    } finally {
      setIsAutoAssigning(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmTask(selectedTask?._id);
      if (onTaskSave) onTaskSave();
      setShowTaskModal(false);
    } catch (error) {
      alert("Error confirming task: " + error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeTask(selectedTask?._id);
      if (onTaskSave) onTaskSave();
      setShowTaskModal(false);
    } catch (error) {
      alert("Error completing task: " + error);
    }
  };

  const handleAddMember = () => {
    const skills = (autoAssignResult?.requiredSkills || []).join(',');
    setShowTaskModal(false);
    navigate(`/teams?requiredSkills=${encodeURIComponent(skills)}&openModal=true`);
  };

  const toggleAssignee = (member) => {
    if (!canEdit) return;
    const isAlreadyAssigned = (formData.assignees || []).some(a => (a._id || a) === member._id);
    if (isAlreadyAssigned) {
      setFormData({ ...formData, assignees: formData.assignees.filter(a => (a._id || a) !== member._id) });
    } else {
      setFormData({ ...formData, assignees: [...(formData.assignees || []), member._id] });
    }
  };

  const validationBadge = selectedTask?.validationStatus;
  const hasSubmission = selectedTask?.submission?.submittedAt;
  const aiEval = selectedTask?.aiEvaluation;

  if (!showTaskModal) return null;

  return (
    <div className="fixed top-16 left-0 md:left-64 right-0 bottom-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {selectedTask ? (isEventMode ? 'Event Details' : 'Task Details') : (isEventMode ? 'Create Event' : 'Create Task')}
            {validationBadge === 'approved' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Completed
              </span>
            )}
            {validationBadge === 'pending' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                Under Review
              </span>
            )}
          </h2>
          <button
            onClick={() => { setShowTaskModal(false); setSelectedTask(null); }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* ── BASIC FIELDS ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={!canEdit}
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={!canEdit}
              placeholder="Enter task description"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none disabled:opacity-70"
            />
          </div>

          {/* Required Skills */}
          {canEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Required Skills <span className="text-gray-400 text-xs">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={requiredSkillsInput}
                onChange={(e) => setRequiredSkillsInput(e.target.value)}
                placeholder="e.g. React, Node.js, MongoDB"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          )}
          {!canEdit && (formData.requiredSkills || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {formData.requiredSkills.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">{s}</span>
              ))}
            </div>
          )}

          {/* Project selector */}
          {!fixedProjectId && isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
              <select
                value={formData.project || ''}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                disabled={!!selectedTask?._id}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70"
              >
                <option value="">Select a Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={formData.status || 'Pending'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={!canEdit}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70"
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                disabled={!canEdit}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              disabled={!canEdit}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70"
            />
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignees</label>
            <div className="flex flex-wrap gap-2">
              {(teamMembers || []).map(member => {
                const isAssigned = (formData.assignees || []).some(a => (a._id || a) === member._id);
                return (
                  <div
                    key={member._id}
                    onClick={() => toggleAssignee(member)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                      isAssigned
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-1 ring-blue-500/50"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-400"
                    } ${!canEdit ? 'pointer-events-none opacity-80' : ''}`}
                  >
                    <img
                      src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff&size=64`}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{member.name}</span>
                      {(member.skills || []).length > 0 && (
                        <p className="text-[10px] text-gray-400 truncate max-w-[80px]">{member.skills.slice(0,2).join(', ')}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── AI AUTO-ASSIGN (Admin only, for existing task) ── */}
          {isAdmin && selectedTask?._id && !isEventMode && (
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">AI Auto-Assign</span>
                </div>
                <button
                  onClick={handleAutoAssign}
                  disabled={isAutoAssigning}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 shadow-lg shadow-indigo-500/20"
                >
                  {isAutoAssigning ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing…</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> AI Auto-Assign</>
                  )}
                </button>
              </div>
              <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
                Gemini AI will match this task's required skills with your team and assign the best fit.
              </p>

              {/* Auto-assign result: SUCCESS */}
              {autoAssignResult?.assigned && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      Assigned to {autoAssignResult.assignedUser?.name}
                    </span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {Math.round((autoAssignResult.matchConfidence || 0) * 100)}% match
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{autoAssignResult.reasoning}</p>
                </div>
              )}

              {/* Auto-assign result: NO MATCH */}
              {autoAssignResult?.noMatch && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300">No qualified member found</span>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                    No team member has the required skills: <strong>{(autoAssignResult.requiredSkills || []).join(', ') || 'N/A'}</strong>
                  </p>
                  <button
                    onClick={handleAddMember}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Add Member with Required Skills
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TASK EXECUTION SECTION (Employees + Admin) ── */}
          {selectedTask && !isEventMode && (
            <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-500" /> Task Execution
              </h3>

              {/* Existing Submission Details */}
              {hasSubmission && (
                <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Last Submission</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{selectedTask.submission.fileName || 'File submitted'}</span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(selectedTask.submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedTask.submission.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{selectedTask.submission.description}</p>
                  )}
                  {/* AI Evaluation Result */}
                  {aiEval?.feedback && (
                    <div className={`mt-2 p-2 rounded-lg text-xs ${
                      validationBadge === 'approved'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                    }`}>
                      <div className="flex items-center gap-1 font-bold mb-0.5">
                        <Bot className="w-3 h-3" /> AI Feedback
                        {aiEval.confidence != null && (
                          <span className="ml-auto opacity-70">
                            {selectedTask.aiScore ? `Score: ${selectedTask.aiScore} | ` : ''}
                            {Math.round(aiEval.confidence * 100)}% confident
                          </span>
                        )}
                      </div>
                      {aiEval.feedback}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Result Banner (after submission) */}
              {submitResult && (
                <div className={`mb-4 p-4 rounded-xl border ${
                  submitResult.autoCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm mb-1 ${submitResult.autoCompleted ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}">
                    {submitResult.autoCompleted ? <CheckCircle className="w-4 h-4" /> : <Loader2 className="w-4 h-4" />}
                    {submitResult.message}
                  </div>
                  {submitResult.aiEvaluation?.feedback && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{submitResult.aiEvaluation.feedback}</p>
                  )}
                </div>
              )}

              {/* Employee: Submit work */}
              {!isAdmin && selectedTask.status !== 'Completed' && (
                <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-3 uppercase tracking-wider">
                    Submit Proof of Completion
                  </p>

                  {/* File Upload */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 cursor-pointer hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20 transition-colors mb-3"
                  >
                    <Upload className="w-5 h-5 text-indigo-400" />
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{selectedFile.name}</p>
                        <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload document</p>
                        <p className="text-xs text-gray-400">PDF, DOCX, TXT, PNG, JPG (max 10MB)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <textarea
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 mb-3 resize-none dark:text-white"
                    placeholder="Optional: Add notes, PR link, or any details..."
                    rows={2}
                  />
                  <button
                    onClick={handleSubmitWork}
                    disabled={isSubmitting || (!workDescription.trim() && !selectedFile)}
                    className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with AI…</>
                    ) : (
                      <><Bot className="w-4 h-4" /> Submit for AI Evaluation</>
                    )}
                  </button>
                </div>
              )}

              {/* Autonomous Flow Buttons for Members */}
              {!isAdmin && selectedTask.status === 'Awaiting-Confirmation' && (
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 w-full justify-center bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 animate-pulse"
                >
                  <UserCheck className="w-5 h-5" /> Confirm Task & Start Working
                </button>
              )}

              {!isAdmin && selectedTask.status === 'In-Progress' && (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 w-full justify-center bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  <CheckCircle className="w-5 h-5" /> Mark as Completed
                </button>
              )}

              {/* Admin: Manual Verify */}
              {isAdmin && (
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Admin Override</p>
                  <textarea
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 mb-3 resize-none dark:text-white"
                    placeholder="Add feedback for the employee (optional)..."
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify('approved')}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleVerify('rejected')}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900 rounded-b-2xl">
          {selectedTask && isAdmin && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
          <div className="flex items-center justify-end gap-3 ml-auto">
            <button
              onClick={() => { setShowTaskModal(false); setSelectedTask(null); }}
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            {canEdit && (
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {selectedTask ? 'Save Changes' : (isEventMode ? 'Create Event' : 'Create Task')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
