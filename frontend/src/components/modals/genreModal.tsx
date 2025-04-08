import React from "react";
import Modal from "../Modal";

export interface GenresModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
  genres: string[];
}

export const GenresModal: React.FC<GenresModalProps> = ({
  isOpen,
  onClose,
  selectedGenres,
  toggleGenre,
  genres,
}) => {
  if (!isOpen) return null;

  return (
    <Modal title="Seleccionar generos" onClose={onClose} className="bg-rojo-intec-200">
      <div className="p-3.5 bg-rojo-intec-200 rounded-[10px] flex flex-col w-full">
        <div className="bg-white rounded-[10px] outline outline-1 outline-black p-3.5 ">
          <div className="flex flex-wrap justify-center gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`w-32 h-9 px-3 py-1 rounded-3xl flex items-center justify-center transition-all ${
                  selectedGenres.includes(genre)
                    ? "bg-rojo-intec-200 outline-none font-bold"
                    : "bg-white outline outline-1 outline-Base-Negro hover:bg-rojo-intec-100"
                }`}
              >
                <span className="text-xs font-barlow font-semibold truncate">
                  {genre}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GenresModal;
