import React, {useState, useCallback, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/Auth.context"

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        console.log("error", error)
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value })
    }

    // register
    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)

        } catch (e) {

        }
    }

    // login
    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            message(data.message)
            auth.login(data.token, data.userId)
        } catch (e) {

        }
    }



    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>make link short</h1>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>


                    <div className="input-field">
                        <input placeholder="Input email"
                               id="email"
                               type="text"
                               name="email"
                               className="yellow-input"
                               value={form.email}
                               onChange={changeHandler}
                              />
                            <label htmlFor="email">Email</label>
                    </div>

                    <div className="input-field">
                        <input placeholder="Input password"
                               id="password"
                               type="password"
                               name="password"
                               className="yellow-input"
                               value={form.password}
                               onChange={changeHandler}
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    <div className="card-action">
                        <button
                            className="btn login-btn yellow darken-4"
                        disabled={loading}
                            onClick={loginHandler}
                        >Login</button>
                        <button
                            className="btn grey lighten-1 black-text"
                        onClick={registerHandler}
                            disabled={loading}
                        >Register</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}