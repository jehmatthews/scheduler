import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(intial) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

  const updateSpots = (day, update) => {
    const days = state.days;

    let daysIndex = -1;

    const dayUpdate = days.find((item, index) => {
      if (item.name === day) {
        daysIndex = index;
        return item;
      }
    })

    if (update) {
      dayUpdate.spots++
    } else {
      dayUpdate.spots--
    }

    return days;
  }

  const bookInterview = (id, interview, edit = false) => {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => { setState({ ...state, appointments, days: edit ? state.days: updateSpots(state.day, false) }) });
  };

  const cancelInterview = id => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => { setState({ ...state, appointments, days: updateSpots(state.day, true) }) })

  };

  return { state, setDay, bookInterview, cancelInterview };
}