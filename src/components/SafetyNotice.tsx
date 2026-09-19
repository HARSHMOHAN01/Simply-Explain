

export default function SafetyNotice() {
  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 flex gap-4">
      <span className="text-3xl shrink-0" aria-hidden="true">🛡️</span>
      <p className="text-lg text-gray-700 leading-relaxed font-medium">
        For important financial, medical, legal or government decisions, 
        please verify the information with an official source or qualified professional.
      </p>
    </div>
  );
}
