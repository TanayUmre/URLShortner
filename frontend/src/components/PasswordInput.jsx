import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

function PasswordInput({id,label,placeholder,value,onChange}){
    const [showPassword,setShowPassword]=useState(false);
    return (
        <div className="form-group">
            <label htmlFor={id}>
                {label}
            </label>
            <div className="password-input-wrapper">
                <input id={id} type={showPassword?"text":"password"} placeholder={placeholder} value={value} onChange={onChange} required/>
                <button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Hide Password":"Show Password"}>{showPassword?(<EyeOff size={19}/>):(<Eye size={19}/>)}</button>
            </div>
        </div>
    );
}

export default PasswordInput;