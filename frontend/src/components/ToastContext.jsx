import {createContext,useCallback,useContext,useState} from "react";
import Toast from "./Toast";

const ToastContext=createContext();

export function ToastProvider({children}){
    const [toast,setToast]=useState({
        message:"",
        type:"success"
    });
    const showToast=useCallback((message,type="success")=>{
        setToast({
            message,type
        });
    },[]);
    const hideToast=useCallback(()=>{
        setToast({
            message:"",
            type:"success"
        });
    },[]);

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
            <Toast message={toast.message} type={toast.type} onClose={hideToast}/>
        </ToastContext.Provider>
    );
}

export function useToast(){
    return useContext(ToastContext);
}