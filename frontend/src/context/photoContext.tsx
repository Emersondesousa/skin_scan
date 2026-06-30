import { createContext, ReactNode, useContext, useState } from "react";

type PhotoContextData = {
    photo: string;
    setPhoto: (photo: string) => void;
};

const PhotoContext = createContext<PhotoContextData>({
    photo: "",
    setPhoto: () => {},
});

export function PhotoProvider({ children }: { children: ReactNode }) {
    const [photo, setPhoto] = useState("");

    return (
        <PhotoContext.Provider value={{ photo, setPhoto, }}>
            {children}
        </PhotoContext.Provider>
    );
}

export function usePhoto() {
    return useContext(PhotoContext);
}