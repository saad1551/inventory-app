import React, { useState } from 'react';
import styles from "./auth.module.scss";
import {MdPassword} from "react-icons/md";
import Card from '../../components/card/Card';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../services/authService';

const initialState = {
    password: "",
    password2: ""
}

const Reset = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const { password, password2 } = formData;
    const { resetToken } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        })
    };

    const reset = async(e) => {
        e.preventDefault();

        if (password.length < 6) {
            return toast.error("Passwords must be at least of 6 characters");
        }
        if (password !== password2) {
            return toast.error("Passwords do not match");
        }

        const userData = {
            password,
            password2
        }

        try {
            const data = await resetPassword(userData, resetToken);
            toast.success(data.message);
            navigate("/login");
        } catch (error) {
            console.log(error.message);
        }

        console.log(resetToken);
    }

  return (
    <div className={`container ${styles.auth}`}>
        <Card>
            <div className={styles.form}>
                <div className="--flex-center">
                    <MdPassword size={35} color="#999"/>
                </div>
                <h2>Reset Password</h2>

                <form onSubmit={(e) => reset(e)}>
                    <input type="password"
                    placeholder="New Password"
                    value={password} onChange={handleInputChange}
                    required name="password" />
                    <input type="password"
                    placeholder="Confirm New Password"
                    value={password2} onChange={handleInputChange}
                    required name="password2" />

                    <button type="submit" className="--btn --btn-primary --btn-block">Get Reset Email</button>
                    <div className={styles.links}>
                        <Link to="/">- Home</Link>
                        <Link to="/login">- Login</Link>
                    </div>
                </form>

            </div>
        </Card>
    </div>
  )
}

export default Reset