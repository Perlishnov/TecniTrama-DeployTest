import { ProjectFormat } from "@/types/index";
import Modal from "../Modal";
interface FormatSelectorProps {
  isOpen: boolean;
  formats: ProjectFormat[];
  selectedFormat: ProjectFormat | null;
  onSelect: (format: ProjectFormat) => void;
  onClose: () => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  isOpen,
  formats,
  selectedFormat,
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal title="Seleccionar Formato" onClose={onClose} className="bg-rojo-intec-200">
      <div className="bg-white rounded-[10px] outline outline-1 outline-black p-4">
        <div className="flex flex-wrap gap-3">
          {formats.map((format) => (
            <button
              key={format.format_id}
              className={`w-32 h-9 px-3 py-1 rounded-3xl flex items-center justify-center transition-all ${
                selectedFormat?.format_id === format.format_id
                  ? "bg-rojo-intec-200 outline-none font-bold"
                  : "bg-white outline outline-1 outline-Base-Negro hover:bg-rojo-intec-100"
              }`}
              onClick={() => onSelect(format)}
            >
              <span className="text-xs font-barlow font-semibold truncate">
                {format.format_name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default FormatSelector;