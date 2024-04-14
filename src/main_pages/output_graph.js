import React, { useRef, useEffect} from 'react';
import * as d3 from 'd3';

const CN = 0;
//const EN = 1;

export function OutputGraph({thetas, lang}) {
    const chartRef = useRef(null);
    const width = 480, height = 465;
    const {theta1, theta2, thetaC} = thetas;
    const TIR_cn = '全反射: (入射角 > 临界角)', TIR_en = 'Total Internal Reflection';
    const TIR = (lang===CN) ? TIR_cn : TIR_en;
    const noC_cn = '无临界角: (光疏->光密)', noC_en = 'No crit. ang. (Rare->Dense)';
    const noCritical = (lang===CN) ? noC_cn : noC_en;
    const Medium1_cap_cn = '介质 I', Medium1_cap_en = 'Medium I';
    const Medium1_cap = (lang===CN) ? Medium1_cap_cn : Medium1_cap_en;
    const Medium2_cap_cn = '介质 II', Medium2_cap_en = 'Medium II';
    const Medium2_cap = (lang===CN) ? Medium2_cap_cn : Medium2_cap_en;

    // Incident/Reflect
    let x1 = -1, y1 = 1;
    if (theta1<45.0) {x1=-Math.tan(theta1/180.0*Math.PI)}
    else {y1=Math.tan((90.0-theta1)/180.0*Math.PI)};

    // Refraction, if exists
    let x2 = 1, y2 = -1;
    const NaNtheta2 = isNaN(theta2);
    if (!NaNtheta2) {
        if(theta2<45.0) {x2=Math.tan(theta2/180.0*Math.PI)}
        else {y2=-Math.tan((90.0-theta2)/180.0*Math.PI)};
    }

    // Critical angle, if exists
    let xC = -1, yC = 1;
    const NaNthetaC = isNaN(thetaC);
    if (!NaNthetaC) {
        if(thetaC<45.0) {xC=-Math.tan(thetaC/180.0*Math.PI)}
        else {yC=Math.tan((90.0-thetaC)/180.0*Math.PI)};
    }

    useEffect( ()=> {

        const margin = { top: 25, right: 40, bottom: 25, left: 40 };

        const svg = d3.select(chartRef.current);
        svg.selectAll('*').remove();
     
        const xScale = d3.scaleLinear()
                        .domain([-1, 1])
                        .range([margin.left, width-margin.right]);
        
        
        const yScale = d3.scaleLinear()
                        .domain([-1, 1])
                        .range([height-margin.bottom, margin.top]);

        const regionX = (width-margin.right-margin.left);
        const regionY = (height-margin.bottom-margin.top)/2;
 
        svg.append("defs")
            .append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 120)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "blue");


        // Draw M1 and M2
        const dense_color = '#e0e0e0', rare_color = '#f5f5f5', middle_color='#c0e0ff'; // define light color for rare medium, dark color for dense medium
        let M1_color = rare_color, M2_color = rare_color, M1_rarer_M2 = 0;
        
        if(!NaNtheta2 && theta1-theta2 > 1e-5) M1_rarer_M2 += 1; // Medium 1 is less dense, so top-part should show lighter color 
        if(NaNtheta2 || theta1-theta2 < -1e-5) M1_rarer_M2 -= 1;

        if (M1_rarer_M2 > 0) {    // Medium 1 is less dense, so top-part should show lighter color 
            M2_color = dense_color;
        }
        else if (M1_rarer_M2 < 0) { 
            M1_color = dense_color;
        }
        else {

        }

        // render colors for M1 and M2 areas

        svg.append('rect').attr('x',xScale(-1)).attr('y',yScale(+1))
                          .attr('stroke', M1_color)
                          .attr('width',regionX).attr('height', regionY)
                          .attr('fill', M1_color)

        svg.append('rect').attr('x',xScale(-1)).attr('y',yScale(0))
                          .attr('stroke', M2_color)
                          .attr('width',regionX).attr('height', regionY)
                          .attr('fill', M2_color)

        svg.append("text").attr("transform", `translate(${width*0.12},${height*0.48})`)
                          .style("text-anchor", "left") // Centers the text above the axis
                          .style("fill", "#3070c0")
                          .text(Medium1_cap);             
        svg.append("text").attr("transform", `translate(${width*0.12},${height*0.54})`)
                          .style("text-anchor", "left") // Centers the text above the axis
                          .style("fill", "#20a0c0")
                          .text(Medium2_cap);       

        // Draw Interface of M1 and M2
        svg.append('line').attr('x1',xScale(-1)).attr('y1',yScale(0))
                          .attr('x2',xScale(+1)).attr('y2',yScale(0))
                          .attr('stroke', 'black') // Set the line color
                          .attr('stroke-width', 2) // Set the line width
                          .attr('fill', 'none'); // Ensure the line does not get filled

        // Draw Normal line
        svg.append('line').attr('x1',xScale(0)).attr('y1',yScale(-1))
                          .attr('x2',xScale(0)).attr('y2',yScale(+1))
                          .attr('stroke', 'black') // Set the line color
                          .attr('stroke-width', 1.5) // Set the line width
                          .style("stroke-dasharray", "5,5") // dashed line
                          .attr('fill', 'none'); // Ensure the line does not get filled

        // Draw Incident line
        svg.append('line').attr('x1',xScale(x1)).attr('y1',yScale(y1))
                          .attr('x2',xScale(0)).attr('y2',yScale(0))
                          .attr('stroke', '#ff00ff') // Set the line color
                          .attr('stroke-width', 2) // Set the line width
                          .attr("marker-end", "url(#arrow)") // Use the marker-end attribute to add the arrow to the line
                          .attr('fill', 'none'); // Ensure the line does not get filled

        // Draw Reflect line
        svg.append('line').attr('x1',xScale(0)).attr('y1',yScale(0))
                          .attr('x2',xScale(-x1)).attr('y2',yScale(y1))
                          .attr('stroke', '#ff90c0') // Set the line color
                          .attr('stroke-width', 1.5) // Set the line width
                          .attr("marker-end", "url(#arrow)")
                          .attr('fill', 'none'); // Ensure the line does not get filled

        // Only if refraction exists, Draw it
        if (!NaNtheta2)
        svg.append('line').attr('x1',xScale(0)).attr('y1',yScale(0))
                          .attr('x2',xScale(x2)).attr('y2',yScale(y2))
                          .attr('stroke', '#a050ff') // Set the line color
                          .attr('stroke-width', 1.5) // Set the line width
                          .attr("marker-end", "url(#arrow)")
                          .attr('fill', 'none'); // Ensure the line does not get filled
        else {
            //Append 全反射
            svg.append("text")             
            .attr("transform", `translate(${width*0.7},${height*0.75})`)
            .style("text-anchor", "middle") // Centers the text above the axis
            .style("fill", "red")
            .text(TIR);
        }

        // Only if critical angle exists, Draw it
        if (!NaNthetaC)
        svg.append('line').attr('x1',xScale(0)).attr('y1',yScale(0))
                          .attr('x2',xScale(xC)).attr('y2',yScale(yC))
                          .attr('stroke', 'orange') // Set the line color
                          .attr('stroke-width', 1.5) // Set the line width
                          .style("stroke-dasharray", "5,5") 
                          .attr('fill', 'none'); // Ensure the line does not get filled
        else {

            //Append 不存在临界角
            svg.append("text")             
            .attr("transform", `translate(${width*0.29},${height*0.75})`)
            .style("text-anchor", "middle") // Centers the text above the axis
            .style("fill", "orange")
            .text(noCritical);
        }


            const XaxisGenerator = d3.axisBottom(xScale);
            svg.append("g").call(XaxisGenerator).attr('transform', `translate(0,${height - margin.bottom})`);
    
            const XaxisGenerator2 = d3.axisTop(xScale);
            svg.append("g").call(XaxisGenerator2).attr('transform', `translate(0,${margin.top})`);
    
            const YaxisGenerator = d3.axisLeft(yScale);
            svg.append("g").call(YaxisGenerator).attr('transform', `translate(${margin.left},0)`);
    
            const YaxisGenerator2 = d3.axisRight(yScale);
            svg.append("g").call(YaxisGenerator2).attr('transform', `translate(${width - margin.right},0)`);

    }, [thetas, lang]);


    return (
        <div>
            <svg width={width+'px'} height={height+'px'} ref={chartRef} />
            
        </div>
    );
}