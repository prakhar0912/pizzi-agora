import { useState, useRef, createContext, useContext } from 'react'
import Pizzicato from 'pizzicato'

const UserContext = createContext()
const StartContext = createContext()
const ClientContext = createContext()
const SpeakingContext = createContext()
const AudioEffectsContext = createContext()



export const useUsers = () => {
    return useContext(UserContext)
}


export const useStart = () => {
    return useContext(StartContext)
}


export const useClient = () => {
    return useContext(ClientContext)
}

export const useSpeaking = () => {
    return useContext(SpeakingContext)
}

export const useAudioEffects = () => {
    return useContext(AudioEffectsContext)
}


export const GlobalProvider = ({ children }) => {

    const [users, setUsers] = useState([])
    const [start, setStart] = useState(false)
    const rtc = useRef({
        // For the local client.
        client: null,
        // For the local audio and video tracks.
        localAudioTrack: null,
        localVideoTrack: null,
        checkSpeakingInterval: null
    });
    const [speaking, setSpeaking] = useState(false)

    var delay = new Pizzicato.Effects.Delay({
        feedback: 0.6,
        time: 0.4,
        mix: 0.5
    });
    var pingPongDelay = new Pizzicato.Effects.PingPongDelay({
        feedback: 0.6,
        time: 0.4,
        mix: 0.5
    });
    var distortion = new Pizzicato.Effects.Distortion({
        gain: 0.4
    });
    var quadrafuzz = new Pizzicato.Effects.Quadrafuzz({
        lowGain: 0.6,
        midLowGain: 0.8,
        midHighGain: 0.5,
        highGain: 0.6,
        mix: 1.0
    });
    var reverb = new Pizzicato.Effects.Reverb({
        time: 0.01,
        decay: 0.01,
        reverse: false,
        mix: 0.5
    });

    var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
        frequency: 200,
        peak: 10
    });

    const [audioEffects, setAudioEffects] = useState({
        PingPongDelay: { effect: pingPongDelay, active: false },
        Delay: { effect: delay, active: false },
        Distortion: { effect: distortion, active: false },
        Quadrafuzz: { effect: quadrafuzz, active: false },
        Reverb: { effect: reverb, active: false },
        LowPassFilter: { effect: lowPassFilter, active: false },
        voice: null
    })


    return (
        <AudioEffectsContext.Provider value={[audioEffects, setAudioEffects]}>
            <SpeakingContext.Provider value={[speaking, setSpeaking]}>
                <ClientContext.Provider value={rtc}>
                    <UserContext.Provider value={[users, setUsers]}>
                        <StartContext.Provider value={[start, setStart]}>
                            {children}
                        </StartContext.Provider>
                    </UserContext.Provider>
                </ClientContext.Provider>
            </SpeakingContext.Provider>
        </AudioEffectsContext.Provider>
    )
}
