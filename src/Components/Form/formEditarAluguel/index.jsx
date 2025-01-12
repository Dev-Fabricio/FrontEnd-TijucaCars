import React from "react"
import { ToastContainer, toast } from "react-toastify"
import { useState, useEffect } from 'react'
import { ButtonSubmit } from "../buttonSubmit"

import * as C from './styles'
import Api from "../../../services/api"
import moment from "moment"

export const FormEditarAluguel = ({ idCarro, idAluguel }) => {

    const [qtdeDiasAlugados, setQtdeDiasAlugados] = useState(0)
    const [dataRetirada, setDataRetirada] = useState('')
    const [dataEntrega, setDataEntrega] = useState('')
    const [valorAluguel, setValorAluguel] = useState(0)
    const [dataReserva, setDataReserva] = useState('')
    const [infoCar, setInfoCar] = useState(0)
    const [status, setStatus] = useState(0);
    const [idCliente, setIdCliente] = useState(undefined)

    const notifySucc = () => toast.success('Aluguel Alterado!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });;

    useEffect(() => {
        const buscarId = localStorage.getItem('UserID')
        setIdCliente(buscarId)
    }, [])

    useEffect(() => {
        async function getSingleCar() {
            const responseInfo = await Api.get(`carros/${idCarro}`)
            setInfoCar(responseInfo.data.response[0])
        }
        getSingleCar()
        setValorAluguel(0)
        setQtdeDiasAlugados(0)
    }, [idCarro])

    useEffect(() => {
        dataDaReserva();
        setValorAluguel(infoCar.valorDiaAluguel * qtdeDiasAlugados)
    }, [qtdeDiasAlugados])

    function dataDaReserva() {
        const dataMomentoReserva = moment().format('YYYY-MM-DD')
        setDataReserva(dataMomentoReserva)
        onCalcularData(dataReserva, qtdeDiasAlugados)
    }
    function onCalcularData(data, dias) {
        const dataDaEntrega = moment(new Date(dataRetirada)).add(dias, 'days')
        const newDataEntrega = dataDaEntrega.format('YYYY-MM-DD')
        setDataEntrega(newDataEntrega)
    }

    const [errmsg, setErrmsg] = useState('')

    async function editarAluguel(
        dataReserva,
        dataRetirada,
        dataEntrega,
        qtdeDiasAlugados,
        status,
        idAluguel
    ) {
        try {
            if (valorAluguel > 0) {
                const response = await Api.patch('alugueis/alteraAluguel', {
                    dataReserva: dataReserva,
                    dataRetirada: dataRetirada,
                    dataEntrega: dataEntrega,
                    qtdeDiasAlugados: qtdeDiasAlugados,
                    status: status,
                    idAluguel: idAluguel
                })
                notifySucc()

            }
        } catch (error) {
            setErrmsg(error.response.data.mensagem)
            const notifyErr = () => toast.error(errmsg, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            notifyErr()
        }
    }

    return (
        <C.ContainerFormEdit>
            <div className='form-model-cliente'>
                <div className='campo-input'>
                    <label>Modelo do Veículo</label>
                    <select
                        defaultValue={'DEFAULT'}
                        disabled
                    >
                        <option value="DEFAULT" selected>
                            {infoCar.modelo}
                        </option>
                    </select>
                </div>

                <div className='campo-input'>
                    <label>Data Retirada</label>
                    <input
                        value={dataRetirada}
                        type="date"
                        onChange={e => setDataRetirada(e.target.value)}
                    />
                </div>
                <div className='campo-input'>
                    <label>Quantidade de Dias</label>
                    <input
                        type="number"
                        value={qtdeDiasAlugados}
                        onChange={e => setQtdeDiasAlugados(e.target.value)}
                    />
                </div>
                <div className='price-div'>
                    <p>Preço:</p>
                    <span>R${valorAluguel > 0 ? valorAluguel : '0'}</span>
                </div>
            </div>

            <div className='submit-button-alugar'>
                <ButtonSubmit text="Modificar" onClick={() => editarAluguel
                    (
                        dataReserva,
                        dataRetirada,
                        dataEntrega,
                        qtdeDiasAlugados,
                        status,
                        idAluguel
                    )}
                />
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={1}
            />
        </C.ContainerFormEdit>
    )
}