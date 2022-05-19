import React from "react";
import Style from "../styles/thanks.module.scss";

import thanksMas from "../assets/image/thanks/thanksmsg.png";
import { Navigate } from "react-router-dom";

interface IProp {}

export default class ThanksComponent extends React.Component<IProp> {
  constructor(props: IProp) {
    super(props);
  }

    componentDidMount() {
    setTimeout(() => {
      window.location.assign('/');
    }, 3000);
  }

  render(): React.ReactNode {
    return (
      <>
          <div className={Style.thanks_container}>
            <div className={Style.brands_container}>
                <div className={Style.thanks_text}>
                    <img
                        alt="thanks message"
                        src={thanksMas}
                        className={Style.thanks_msg}
                    />
                </div>
            </div>
          </div>
      </>
    );
  }
}