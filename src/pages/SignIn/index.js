import React from 'react';
import { Link } from "react-router-dom"
import "./signin.css"
import { useState , useContext } from "react"
import { AuthContext } from "../../contexts/auth"
import logo from "../../assets/logo.png"


function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, loadingAuth } = useContext(AuthContext);


  function handleSubmit(evento){
    evento.preventDefault(); //para nao atualizar a pagina por ser formulario com submit
    
    if(email !== "" && password !== ""){
      signIn(email, password);
    }
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
            <img src={logo} alt="logo do sistema" />
        </div>

        <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input type="text" placeholder='email@email.com' value={email} onChange={(evento)=> setEmail(evento.target.value)}/>
            <input type="password" placeholder='*********' value={password} onChange={(evento)=> setPassword(evento.target.value)} />
            <button type="submit" >{loadingAuth ? "Carregando..." : "Acessar"}</button>
        </form>

            <Link to="/register">Criar uma conta</Link>

      </div>
    </div>
  );
}

export default SignIn;
