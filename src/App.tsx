import { useEffect, useState } from 'react'
import './App.css'
import axios, { Axios } from 'axios';
import { API_BASE_URL } from './config/config';
import { Dorayaki } from './types/Dorayaki';
import { SuccessResWithData } from './types/SuccessResWithData';
import { Store } from './types/Store';


function App() {
  const [dorayakis, setDorayakis] = useState<Array<Dorayaki>>([])
  const [stores, setStores] = useState<Array<Store>>([])

  useEffect(() => {
    const fetchAndInitData = async () => {
      try{
        const resDorayakis: SuccessResWithData<Array<Dorayaki>> = 
          (await axios.get(API_BASE_URL + '/v1/dorayakis')).data

        const resStore: SuccessResWithData<Array<Store>> = 
          (await axios.get(API_BASE_URL + '/v1/stores')).data

        setDorayakis(resDorayakis.data)
        setStores(resStore.data)
      } catch(err){
        console.log(err)
      }
    }
    fetchAndInitData()
  }, [])

  return (
    <div className="App">
      <h2>Stores:</h2>
      {stores.map((store) => (
        <div key={store.id}>
          <p>{store.province}</p>
        </div>
      ))}
    </div>
  )
}

export default App
