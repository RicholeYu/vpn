import { Component, createSignal, onMount } from 'solid-js';

import styles from './App.module.css';

const App: Component = () => {
  const href = location.href;
  const isSet = href.includes('/set/')
  const isHas = href.includes('/has/')
  const isError = href.includes('/error/')

  const ip = (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.exec(href) || [])[0]
  const [message, setMessage] = createSignal("Go");

  onMount(() => {
    if (isSet) {
      setMessage(`iptables for ${ip} is set successfully`)
    }

    if (isHas) {
      setMessage(`${ip} is already in whiteList`)
    }

    if (isError) {
      setMessage(`something error: ${href.split('error/')[1]}`)
    }
  })

  const clickHandler = () => {
    if (ip) {
      location.href = `http://vpn.richole.cn/add/${ip}`
    }
  }

  return (
    <div class={styles.App}>
      <button class={styles.go} onclick={clickHandler}>{message()}</button>
    </div>
  );
};

export default App;
