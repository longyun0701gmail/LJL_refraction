import React from "react";
import {useState} from "react";
import {OutputGraph} from './main_pages/output_graph.js';

import {c0, cw, cg, cd, substances0,get_refrac_angle,get_crit_angle,roundQuantity} from './main_pages/physical_models.js';

const CN = 0, EN = 1;
const model_pic_dir = './assets/';


function GraphicPageTitle({onClickLangFuncs,lang}) {
  const title_en = "Light Reflection and Refraction";
  const title_cn = "光的反射和折射探究";
  const title = (lang===CN)? title_cn:title_en;
  //const applist_use = [applist.ContactAngle, applist.PlaceHolderApp, applist.PlaceHolderApp];

  return (
    <div>
      
    <tr class='tr1'>
      <td width='940px'> <h1b>  {title} </h1b> </td> 
      <td width='60px' align="right"><lang> <div class="highlight_shift" onClick={onClickLangFuncs[0]}>简体中文</div>
                                             <div class="highlight_shift" onClick={onClickLangFuncs[1]}>English</div></lang></td>
    </tr>


    </div>
  )
}

function FootNote({lang}) {

  const footnote_cn = 'Copyright © 2024 制作人 龙君纶 杭州绿城育华学校';
  const footnote_en = "Copyright © 2024 made with react.js by Long Junlun Hangzhou GreenTown Yuhua School";

  const declare_cn = '本应用程序只能用于非盈利的教学目的'
  const declare_en = 'For non-profitable educational purpose only'

  const footnote = (lang===CN)? footnote_cn:footnote_en;
  const declare = (lang===CN)? declare_cn:declare_en;

  return (
    <tr>
      {declare}
      <br/>
      {footnote}
    </tr>

  )

}


function Main({lang}) {
  const substance_list1 = ['Air', 'Water','Glass', 'Diamond', 'Cust1'];
  const substance_list2 = ['Air', 'Water','Glass', 'Diamond', 'Cust2'];
  const [M1, setM1] = useState('Air');
  const [M2, setM2] = useState('Water');
  const [Vu1, setVu1] = useState(1.0);
  const [Vu2, setVu2] = useState(0.8);
  const [Nu1, setNu1] = useState(c0/Vu1);
  const [Nu2, setNu2] = useState(c0/Vu2);

  const [theta1, setTheta1] = useState(45.0);  // incident angle

  const Medium1_cap_cn = "介质 I", Medium1_cap_en = "Medium I";
  const Medium1_cap = (lang===CN) ? Medium1_cap_cn : Medium1_cap_en;
  const Medium2_cap_cn = "介质 II", Medium2_cap_en = "Medium II";
  const Medium2_cap = (lang===CN) ? Medium2_cap_cn : Medium2_cap_en;
  const angles_cn = ['入射角', '反射角','折射角','临界角'];
  const angles_en = ['Incident', 'Reflective', 'Refractive', 'Critical'];
  const angles_cap = (lang===CN) ? angles_cn: angles_en;

  const angles_exp_cn = ['输入一个 1-89 度的入射角', 
                         '反射角 = 入射角', 
                         'c1 / c2 = sin(i) / sin(r)', 
                         '密入疏，入射角若大于 arcsin(c1/c2)，无折射' ];
  const angles_exp_en = ['Input an incident angle btw 1-89 degree', 
                         'Reflective = Incident', 
                         'c1 / c2 = sin i / sin r', 
                         'arcsin(c1/c2), above which no refraction at all' ];
  const angles_exp = (lang===CN) ? angles_exp_cn : angles_exp_en;



  const cust1_info = {name_cn: '自定义I',
                      name_en: 'User-defined I',
                      abbr: 'Cust1',
                      v: Vu1,
                      };

  const cust2_info = {name_cn: '自定义II',
                      name_en: 'User-defined II',
                      abbr: 'Cust2',
                      v: Vu2,
                      };
                      
  const substances = {...substances0, 'Cust1': cust1_info, 'Cust2': cust2_info};

  const v1 = substances[M1].v, v2 = substances[M2].v;
  const v1v2theta1 = {v1:v1, v2:v2, theta1:theta1};

  const thetaC = get_crit_angle(v1v2theta1);
  const theta2 = get_refrac_angle(v1v2theta1);
  const thetas = {theta1:theta1, theta2:theta2, thetaC:thetaC};

  const onSelectM1 = (e)=>{
    setM1(e.target.value);
  }

  const onSelectM2 = (e)=>{
    setM2(e.target.value);
  }

  const onVu1Change = (e)=>{
    let inputed = parseFloat(e.target.value);
    if (typeof inputed === "number") {
      if (inputed>3) inputed = 3;
      else if (inputed<0.01) inputed = 0.01;
      setVu1(inputed);
      setNu1(c0/inputed);
    }
  }

  const onVu2Change = (e)=>{
    let inputed = parseFloat(e.target.value);
    if (typeof inputed === "number") {
      if (inputed>3) inputed = 3;
      else if (inputed<0.01) inputed = 0.01;
      setVu2(inputed);
      setNu2(c0/inputed);
    }
  }

  const onNu1Change = (e)=>{
    let inputed = parseFloat(e.target.value);
    if (typeof inputed === "number") {
      if (inputed>300) inputed = 300;
      else if (inputed<1) inputed = 1;
      setNu1(inputed);
      setVu1(c0/inputed);
    }
  }

  const onNu2Change = (e)=>{
    let inputed = parseFloat(e.target.value);
    if (typeof inputed === "number") {
      if (inputed>300) inputed = 300;
      else if (inputed<1) inputed = 1;
      setNu2(inputed);
      setVu2(c0/inputed);
    }
  }

  const onTheta1Change = (e)=>{
    let inputed = parseFloat(e.target.value);
    if (typeof inputed === "number") {
      if (inputed>89) inputed = 89;
      else if (inputed<1) inputed = 1;
      setTheta1(inputed);
    }
  }

  const cols_cn = ['','光速 c', '折射率 n=c0/c'], cols_en = ['','c', 'Refrac Index (n=c0/c)'];
  const cols = (lang===CN)?cols_cn:cols_en;

  return (
    <div>

    <table>
       <tr>{/* first line*/}
        <td width='500px'>

          <br/>

          <tr className="underscore-row" align="center">
            <td width="135px">{Medium1_cap}</td>
            <td width="135px">{cols[1]} (10<sup>8</sup> m/s)</td>
            <td width="135px">{cols[2]}</td>
          </tr>

          {
            substance_list1.map((m0)=>{ 
                const model_name = (lang===CN)?substances[m0].name_cn:substances[m0].name_en;
                const model_abbr = substances[m0].abbr;
                const isCust = (model_abbr === 'Cust1');
                const v = roundQuantity(substances[m0].v,2), n = roundQuantity(c0/v,2);
                return (
                  <tr>
                    <td> 
                    <input type="radio" name="medium1" value={model_abbr} 
                      checked={model_abbr===M1} onClick={onSelectM1}/> {model_name}
                    </td>

                    <td align='center'>
                      {(!isCust)? v:  <input class='inputBox2' type="number" value={Vu1} onChange={onVu1Change} />}
                    </td>
                    <td align='center'>
                      {(!isCust)? n:  <input class='inputBox2' type="number" value={Nu1} onChange={onNu1Change} />}
                    </td>
                  </tr>
            )
            })
          }


          <br/>

          <br/>

          <tr className="underscore-row" align="center">
            <td width="135px">{Medium2_cap}</td>
            <td width="135px">{cols[1]} (10<sup>8</sup> m/s)</td>
            <td width="135px">{cols[2]}</td>
          </tr>

          {
            substance_list2.map((m0)=>{ 
                const model_name = (lang===CN)?substances[m0].name_cn:substances[m0].name_en;
                const model_abbr = substances[m0].abbr;
                const v = roundQuantity(substances[m0].v,2), n = roundQuantity(c0/v,2);
                const isCust = (model_abbr === 'Cust2');
                return (
                  <tr>
                    <td> 
                    <input type="radio" name="medium2" value={model_abbr} 
                      checked={model_abbr===M2} onClick={onSelectM2}/> {model_name}
                    </td>

                    <td align='center'>
                      {(!isCust)? v:  <input class='inputBox2' type="number" value={Vu2} onChange={onVu2Change} />}
                    </td>
                    <td align='center'>
                      {(!isCust)? n:  <input class='inputBox2' type="number" value={Nu2} onChange={onNu2Change} />}
                    </td>
                  </tr>
            )
            })
          }

        <br/><br/>
        <tr>
          {angles_cap[0]}: <input class='inputBox2' type='number' value={roundQuantity(theta1,0)} onChange={onTheta1Change}/>,&nbsp; {angles_exp[0]} <br/>
          {angles_cap[1]}: <input class='inputBox2' value={roundQuantity(theta1,1)} readonly="true"/>,&nbsp; {angles_exp[1]} <br/>
          {angles_cap[2]}: <input class='inputBox2' value={roundQuantity(theta2,1)} readonly="true"/>,&nbsp; {angles_exp[2]} <br/>
          {angles_cap[3]}: <input class='inputBox2' value={roundQuantity(thetaC,1)} readonly="true"/>,&nbsp; {angles_exp[3]} <br/>   
        </tr>

        </td>

        <td width='500px' align="center">
           <OutputGraph thetas={thetas} lang={lang}/>
           

        </td>     

      </tr>
    </table>

    </div>

    
  );
}

export default function PressTemp(){

  //const [showAppState, setAppState] = useState('ContactAngle');
  const [lang, setLang] = useState(CN);

  const onClickLangFuncs = [()=>{setLang(CN)}, ()=>{setLang(EN)}];
  
  return (
    <div>
      <table width="1000px">
        <tr><GraphicPageTitle onClickLangFuncs={onClickLangFuncs} lang={lang}/></tr>
        <br/>
        <tr><Main lang={lang}/>        </tr>
        <br/>
        <tr><FootNote lang={lang}/></tr>
      </table>  

    </div>
  )
    
}