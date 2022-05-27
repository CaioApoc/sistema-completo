import React from 'react';
import { Link } from "react-router-dom"
import { useState , useContext} from "react"
import logo from "../../assets/logo.png"
import { AuthContext } from "../../contexts/auth"


function SignUp() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const {signUp, loadingAuth} = useContext(AuthContext);


  function handleSubmit(evento){
    evento.preventDefault(); //para nao atualizar a pagina por ser formulario com submit
    
    if(nome !== "" && email !== "" && password !== ""){
      signUp(email, password, nome)
    }


  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='login-area'>
            <img src={logo} alt="logo do sistema" />
        </div>

        <form onSubmit={handleSubmit}>
            <h1>Cadastrar uma conta</h1>
            <input type="text" placeholder='Seu nome' value={nome} onChange={(evento)=> setNome(evento.target.value)}/>
            <input type="text" placeholder='email@email.com' value={email} onChange={(evento)=> setEmail(evento.target.value)}/>
            <input type="password" placeholder='*********' value={password} onChange={(evento)=> setPassword(evento.target.value)} />
            <button type="submit" >{loadingAuth ? "Carregando..." : "Cadastrar"}</button>
        </form>

            <Link to="/">Ja possui uma conta ? Entre </Link>

      </div>
    </div>
  );
}

export default SignUp;

