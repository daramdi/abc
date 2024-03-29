import React from "react";
import styled from "styled-components";
import plus from "../../assets/images/bGroup 45.svg";
import marketPlus from "../../assets/images/bmarketupload.svg";
import { useNavigate, Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import axios from "axios";
import { listState } from "../../components/RecoilDummys";
import { idState } from "../../components/RecoilDummys";
import { alertState } from "../../components/RecoilDummys";
import { finishedState } from "../../components/RecoilDummys";


export default function Survey() {
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(true);
  const [showAlert, setShowAlert] = useRecoilState(alertState);
  const [surveyDummys, setSurveyDummys] = useRecoilState(listState);
  const [currentId, setCurrentId] = useRecoilState(idState);
  const [finishedDummys,setFinishedDummys]=useState("");
  const [finished,setFinished]=useRecoilState(finishedState);
  
  const currentDate=(createdAt)=>{
    const nowDate = detailDate(new Date(createdAt));
    return nowDate;
  }

  const isFinished=(e)=>{
    for (let obj of finishedDummys){
      if (obj.dataId===e || obj.surveyId===e){
        return true;
      }
    }
  }

  const detailDate=(a)=>{
    const milliSeconds = new Date() - a;
    const seconds = milliSeconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    if (days<1) return `오늘`
    else if (days < 7) return `${Math.floor(days)}일 전`;
  }

  const gotoMypage = () => {
    navigate(`/mypage`);
  };

  const surveyViewClick = (e, isFinished) => {
    setShowAlert(false);
    navigate(survey ? "/surveyview1" : "/marketview1");
    setCurrentId(e.surveyId?e.surveyId:e.dataId);
    setFinished(isFinished);
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token){
    if (window.location.pathname === "/survey") {
      setSurvey(true);
      axios
        .get(`/api/survey?page=0`,
        {
          headers: {
            'Authorization': token,
        },
      })
        .then((response) => {
          console.log(response)
        
          setSurveyDummys(response.data.data.surveys);
        })
        .catch((response) => {
          console.log(response);
          console.log("응답없음");
        });

        axios
        .get(`/api/survey/respondent`,
        {
          headers: {
            'Authorization': token,
        },
      })
        .then((response) => {
          console.log(response)
        
          setFinishedDummys(response.data.data.surveys);
        })
        .catch((response) => {
          console.log(response);
          console.log("응답없음");
        });

      
    }
    if (window.location.pathname === "/market") {
      setSurvey(false);
      axios
        .get(`/api/data/list`,
          {
            headers: {
              'Authorization': token
            },
          }
        )
        .then((response) => {
          console.log(response)
          setSurveyDummys(response.data.data.datas);
        })
        .catch((response) => {
          console.log(response);
          console.log("응답없음");
        });

        axios
        .get(`/api/data/list/buyer`,
        {
          headers: {
            'Authorization': token,
        },
      })
        .then((response) => {
          console.log(response)
        
          setFinishedDummys(response.data.data.datas);
        })
        .catch((response) => {
          console.log(response);
          console.log("응답없음");
        });
    }
  }
  }, [window.location.pathname]);

  return (
    <>
      <All>
        <Top>
          <Logo className={survey ? "survey" : "market"}></Logo>
          <LBtn onClick={() => navigate("/mypage")}></LBtn>
        </Top>
        <ListWrapper>
          {surveyDummys?.map((e) => {
            return (
              <EachListWrapper
                key={e.surveyId?e.surveyId:e.dataId}
                onClick={() => surveyViewClick(e, isFinished(e.surveyId?e.surveyId:e.dataId))}
                className={isFinished(e.surveyId?e.surveyId:e.dataId)}
              >
                <Title>
                  <Font className='title'>
                    {e.title.length > 15
                      ? `${e.title.substring(0, 14)}...`
                      : e.title}
                  </Font>
                  <Font className='time'>{currentDate(e.createdAt)}</Font>
                </Title>
                <ContentWrapper>{e.description}</ContentWrapper>
              </EachListWrapper>
            );
          })}
          <Blank></Blank>
        </ListWrapper>
      </All>
      <PlusWrapper>
        <Link to={survey ? "/surveycontent" : "/marketcontent"}>
          <Plus src={survey ? plus : marketPlus}></Plus>
        </Link>
      </PlusWrapper>
    </>
  );
}

const All = styled.div`
  overflow-x: hidden;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
`;

const PlusWrapper = styled.div`
  position: fixed;
  top: 77vh;
  left: 75vw;
  width: 92px;
  height: 92px;
`;
const Plus = styled.img`
  position: sticky;
`;

const Top = styled.div`
  width: 90vw;
  height: 41px;
  position: relative;
  margin: 3vh 0vw;
  margin-left: 5vw;
`;

const Logo = styled.div`
  &.survey {
    background: url("src/assets/images/bFrame 16.svg") no-repeat;
  }
  &.market {
    background: url("src/assets/images/bsurveyshop.svg") no-repeat;
  }
  width: 240px;
  height: 41px;
  border: none;
  display: inline-block;
`;
const LBtn = styled.button`
  display: inline-block;
  position: absolute;
  top: 50%;
  margin-top: -15px;
  right: 0%;
  background: url("src/assets/images/bGroup 34 (2).svg") no-repeat;
  width: 32px;
  height: 32px;
  border: none;
`;

const ListWrapper = styled.div`
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 5vw;
  margin-right: 5vw;
`;
const EachListWrapper = styled.div`
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 120px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--white, #fff);
  box-shadow: 0px 2px 11px 0px rgba(0, 0, 0, 0.2);
  margin: 8px 0;
  padding: 2vh 1.2vh;
  &.true {
    background: rgba(0, 0, 0, 0.2);
  }
`;
const Blank = styled.div`
  height: 100px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Font = styled.p`
  color: #000;
  font-family: Poppins;
  font-style: normal;
  line-height: normal;
  &.title {
    font-size: 16px;
    font-weight: 600;
  }
  &.time {
    font-size: 11px;
    font-weight: 400;
  }
  &.content {
    font-size: 11px;
    font-weight: 500;
  }
`;
const ContentWrapper = styled.div`
  width: 100%;
  //331px
  overflow: hidden;
  height: auto;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: pre-line;

  display: -webkit-box;
  -webkit-line-clamp: 3; // 원하는 라인수
  -webkit-box-orient: vertical;

  color: #000;
  font-family: Poppins;
  font-style: normal;
  line-height: normal;
  font-size: 11px;
  font-weight: 500;
`;
