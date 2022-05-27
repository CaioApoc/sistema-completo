import React from "react"
import "./new.css"
import Header from "../../components/Header"
import Title from "../../components/Title"
import {FiPlus} from "react-icons/fi"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../contexts/auth"
import firebase from "../../services/firebaseConnection"
import { toast } from "react-toastify"
import { useHistory, useParams } from "react-router-dom"


export default function New(){
    const {id} = useParams();
    const history = useHistory();

    const [assunto, setAssunto] = useState("suporte")
    const [status, setStatus] = useState("Aberto")
    const [complemento, setComplemento] = useState("");

    const [customers, setCustomers] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [idCustomer, setIdCustomer] = useState(false)

    const { user } = useContext(AuthContext)


    useEffect(()=>{
        async function loadCustomers(){
            await firebase.firestore().collection("customers")
            .get()
            .then((snapshot)=>{
                let lista = [];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id:doc.id,
                        nomeFantasia:doc.data().nomeFantasia
                    })
                })

                if(lista.length === 0){
                    console.log("NENHUMA EMPRESA ENCONTRADA");
                    setCustomers([{id:"1" , nomeFantasia:"teste"}]);
                    setLoadCustomers(false);
                    return;
                }

                setCustomers(lista);
                setLoadCustomers(false)

                if(id){
                    loadId(lista);
                }

            })
            .catch((error)=>{
                console.log("Deu algum erro!", error)
                setLoadCustomers(false);
                setCustomers([{id:"1" , nomeFantasia:""}])
            })
        };

    loadCustomers();
    }, [])


    async function loadId(lista){
        await firebase.firestore().collection("chamados").doc(id)
        .get()
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((error)=>{
            console.log("Erro no ID passado",error);
            setIdCustomer(false)
        })
    }



    //Registra novo chamado
    async function handleRegister(evento){
        evento.preventDefault();

        if(idCustomer){
            await firebase.firestore().collection("chamados")
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(()=>{
                toast.success("Chamado editado com sucesso!")
                setCustomerSelected(0);
                setComplemento("");
                history.push("/dashboard")
            })
            .catch((error)=>{
                toast.error("Erro ao editar, tente novamente mais tarde!")
                console.log(error)
            })

            return;
        }

        await firebase.firestore().collection("chamados")
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(()=>{
            toast.success("Chamado criado com sucesso!")
            setComplemento("");
            setCustomerSelected(0);
        })
        .catch((error)=>{
            toast.error("Ops! Erro ao registrar, tente novamente!");
            console.log(error)
        })
    }

    //chama quando troca o assunto
    function handleChangeSelect(evento){
        setAssunto(evento.target.value);
        console.log(evento.target.value);
    }


    //chama quando troca o status
    function handleOptionChange(evento){
        setStatus(evento.target.value);
    }

    //chama quando troca de cliente
    function handleChangeCustomers(evento){
        // console.log("INDEX DO CLIENTE SELECIONADO:", evento.target.value);
        // console.log("CLIENTE SELECIONADO:", customers[evento.target.value]);

        setCustomerSelected(evento.target.value);
    }


    return(
        <div>
           <Header />

           <div className="content">
              <Title name="Novo chamado">
                <FiPlus size={25} />
              </Title>

              <div className="container">


                <form className="form-profile" onSubmit={handleRegister}>

                    <label>Cliente</label>

                    {loadCustomers ? (
                        <input type="text" disable={true} value="Carregando clientes..." />
                    ):(
                         <select value={customerSelected} onChange={handleChangeCustomers}>
                        {customers.map((item, index)=>{
                            return(
                                <option key={item.id} value={index}>
                                    {item.nomeFantasia}
                                </option>
                            )
                        })}
                    </select>
                    )}
                   

                    <label>Assunto</label>
                    <select value={assunto} onChange={handleChangeSelect}>
                        <option value="Suporte">Suporte</option>
                        <option value="Visita Tecnica">Visita Tecnica</option>
                        <option value="Financeiro">Financeiro</option>
                        <option value="Outros">Outros</option>
                    </select>

                    <label>Status</label>
                    <div className="status">

                        <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={ status === "Aberto"}/>
                        <span>Em aberto</span>

                        <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={ status === "Progresso"}/>
                        <span>Em progresso</span>

                        <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={ status === "Atendido"} />
                        <span>Atendido</span>

                    </div>

                    <label>Complemento</label>
                    <textarea type="text" placeholder="Descreva o problema(opcional)" value={complemento} onChange={(evento)=> setComplemento(evento.target.value)}/>

                    <button type="submit">Registrar</button>

                </form>
              </div>
           </div>
        </div>
    )
}