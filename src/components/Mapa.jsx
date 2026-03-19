import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useState, useRef } from "react";

export default function Mapa(){
    const centroInicial = [-22.913933, -47.00];
    const [posicao, setPosicao] = useState(null);
    const [erro, setErro] = useState("");

    const [pontos, setPontos] = useState([]);
    const idRef = useRef(1);

    function calcularDistancM(alvo, origem){
        if (origem) return null;

        const a = L.latLng(origem);
        const b = L.latLng(alvo.lat, alvo.lng);
        return a.distanceTo(b);

    }

    function formatarM(metros){
        return metros == null ? "--" : metros < 1000 ? `${metros.toFixed(0)}m` : `${(metros / 1000).toFixed(2)}km`;
    }

    function adicionarPonto({lat, lng}){
        const novo = {
            id:idRef.current++,
            lat,
            lng,
            distanciaM:calcularDistancM({lat, lng}, local)
        }

        setPontos( (prev) => [...prev, novo] )

    }

    function limparPontos(){
        setPontos([])
        idRef.current=1
    }

    const pontosOrdenados = [...pontos].sort((a, b) => {
        const da = a.distanciaM ?? Infinity
        const db = b.distanciaM ?? Infinity

    })


    useEffect( () => {        
        if (!("geolocation" ) in navigator){
            setErro("Seu navegador não tem suporte para geolocalização!");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosicao({
                    lat:pos.coords.latitude,
                    lng:pos.coords.longitude
                })
            },

            ()=>{
                setErro("Não foi possível obter sua localização!");
            },

            {
                enableHighAccuracy:true,
                timeout: 8000,
                maximumAge: 0 
            }
        );

    }, []);

    const local = [-22.9137900, -47.06810681000];

    const zoomInicial = local ? 15 : 13;

    function ClickHandler({onAdd}){
        useMapEvents({
            click(e){
                const {lat, lng} = e.latlng
                onAdd({lat, lng})
            }
        });

        return null;
    }


    return (
        <section className="mapa">
            <h1> Mapa</h1>
            <hr />
        
            {erro && <div className="erro">{erro}</div>}

            <section className="painel">
                <div className="painel-topo">
                    <span>Pontos Adicionados</span>

                    <button className="botao" onClick={limparPontos}>
                        Limpar Pontos!
                    </button>
                </div>
            </section>
            
            <MapContainer
                center={posicao ? local : centroInicial}
                zoom = {zoomInicial}
                scrollWheelZoom={true}
                className="mapa"
            >        

                <TileLayer
                    attribution="&copy; OpenstreetMap"
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"      
                />
                
                {local && (
                    <Marker position={local}>
                        <Popup>Você está aqui!</Popup>
                    </Marker>
                )}
                
            </MapContainer>
        </section>
    );   
}