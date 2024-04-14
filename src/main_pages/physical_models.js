export const c0 = 3.0, cw = 2.25, cg = 2.0, cd = 1.2;  // speed in vacuum, typical water and typical glass, respectively, unit = x 10^8 m/s

export function roundQuantity(input,n_digits) {
  if (!isNaN(input) && typeof input === "number") {
    // Input is a valid floating-point number
    const roundedValue = input.toFixed(n_digits);
    return roundedValue;
  } else {
    // Input is not a valid number
    return input;
  }
}

export function get_refrac_angle(v1v2theta1) {
  const {v1,v2,theta1} = v1v2theta1;
  const sintheta2 = v2/v1 * Math.sin(theta1/180.0*Math.PI);
  const theta2 = Math.asin(sintheta2);
  return theta2/Math.PI*180.0;
}

export function get_crit_angle(v1v2) {
  const {v1,v2} = v1v2;
  const sinthetaC = v1/v2;
  const thetaC = Math.asin(sinthetaC);
  return thetaC/Math.PI*180.0
}
  
export const substances0 = {
    'Water':   {name_cn: '典型的水',
                name_en: 'Typical water',
                abbr: 'Water',
                v: cw,
               },

    'Glass':  {name_cn: '典型的玻璃',
                name_en: 'Typical glass',
                abbr: 'Glass',
                v: cg,
               },

    'Air':   {name_cn: '空气/真空',
               name_en: 'Air/Vacuum',
               abbr: 'Air',
               v: c0,
              },

    'Diamond': {name_cn: '钻石',
               name_en: 'Diamond',
               abbr: 'Diamond',
               v: cd,
             },

    }
