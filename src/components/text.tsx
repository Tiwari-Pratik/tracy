import React from "react";
import "./test.css";
const TestList = () => {
  return (
    <div className="container-list">
      <ul className="ul">
        <li className="li">
          <div>
            <p>Item1</p>
          </div>
        </li>
        <li className="li">
          <div>
            <div className="seperator"></div>
          </div>
        </li>
        <li className="li">
          <div>
            <p>Item2</p>
            <ul className="ul">
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item2.1</p>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item2.2</p>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item2.2</p>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className="li">
          <div>
            <div className="seperator"></div>
          </div>
        </li>
        <li className="li">
          <div>
            <p>Item3</p>
            <ul className="ul">
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item3.1</p>
                </div>
              </li>
            </ul>
            <ul className="ul">
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item3.2.1</p>
                  <ul className="ul">
                    <li className="li">
                      <div>
                        <div className="childConnector"></div>
                      </div>
                    </li>
                    <li className="li">
                      <div>
                        <p>Item3.2.1.1</p>
                      </div>
                    </li>
                    <li className="li">
                      <div>
                        <div className="seperator"></div>
                      </div>
                    </li>
                    <li className="li">
                      <div>
                        <p>Item3.2.1.2</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item3.2.2</p>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className="li">
          <div>
            <div className="seperator"></div>
          </div>
        </li>
        <li className="li">
          <div>
            <p>Item4</p>
          </div>
        </li>
        <li className="li">
          <div>
            <div className="seperator"></div>
          </div>
        </li>
        <li className="li">
          <div>
            <p>Item5</p>
            <ul className="ul">
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item5.1</p>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item5.2</p>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item5.3</p>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TestList;
