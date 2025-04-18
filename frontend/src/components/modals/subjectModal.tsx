import { Subject } from "@/types";
import Modal from "../Modal";

interface SubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubjects: Subject[];
  toggleSubject: (subject: Subject) => void;
  subjects: Subject[];
}

export const SubjectsModal = ({
  isOpen,
  onClose,
  selectedSubjects,
  toggleSubject,
  subjects,
}: SubjectsModalProps) => {
  if (!isOpen) return null;

  const isSelected = (subject: Subject) =>
    selectedSubjects.some((s) => s.class_id === subject.class_id);

  return (
    <Modal
      title="Seleccionar Materias"
      onClose={onClose}
      className="bg-rojo-intec-200"
    >
      <div className="p-3.5 bg-rojo-intec-200 rounded-[10px] flex flex-col w-full">
        <div className="bg-white rounded-[10px] outline outline-1 outline-black p-3.5">
          <div className="flex flex-wrap justify-center gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.class_id}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={`w-32 h-9 px-3 py-1 rounded-3xl flex items-center justify-center transition-all ${
                  isSelected(subject)
                    ? "bg-rojo-intec-200 outline-none font-bold"
                    : "bg-white outline outline-1 outline-Base-Negro hover:bg-rojo-intec-100"
                }`}
              >
                <span className="text-xs font-barlow font-semibold truncate">
                  {subject.class_name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SubjectsModal;
