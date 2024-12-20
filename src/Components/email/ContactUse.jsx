import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactUse() {

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_5wfmf26', 'template_xhfvlsc', form.current, {
                publicKey: 'zAxsxa-HMMw991jZH',
            })
            .then(
                () => {
                    console.log('SUCCESS!');
                    alert("your email as been")
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };
    return (
        <form ref={form} onSubmit={sendEmail}>
            <label>Name</label>
            <input type="text" name="user_name" />
            <label>Email</label>
            <input type="email" name="user_email" />
            <label>Message</label>
            <textarea name="message" />
            <input type="submit" value="Send" />
        </form>
    )
}