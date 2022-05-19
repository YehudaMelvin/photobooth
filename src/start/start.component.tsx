import React from "react";
import Style from '../styles/start.module.scss';

import Startbtn from '../assets/image/button.png'

interface IProp{}

export default class StartComponent extends React.Component<IProp> {
    render(): React.ReactNode {
        return (
            <div className={Style.start_container}>
                <div className={Style.brands_container}>
                    <div className={Style.brands_button}>
                        <a href="/Session">
                            <img alt='start button' src={Startbtn}/>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}