import {useEffect,useState} from "react"

function Toast({message,type="success",onClose}){
    const [vis,setvis]=useState(true);
    useEffect(()=>{
        if(!message){
            return;
        }
        setvis(true);
        const fade=setTimeout(()=>{
            setvis(false);
        },2000);
        const close=setTimeout(()=>{
            onClose();
        },3000);

        return ()=>{
            clearTimeout(fade);
            clearTimeout(close);
        };
    },[message,onClose]);
    
    if(!message){
        return null;
    }

    return (
        <div className={`toast toast-${type} ${vis?"toast-show":"toast-hide"}`}>
            <span className="toast-icon">
                {type==='success'?"✓":"✕"}
            </span>
            <span className="toast-message">
                {message}
            </span>
        </div>
    )
}

export default Toast;