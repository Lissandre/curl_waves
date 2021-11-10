vec3 finalPos = position;

vec3 noisy = cnoise(vec3(.0045) * finalPos + vec3(uTime * .09));
noisy = pow(noisy, vec3(2.)) * 12.;

finalPos += noisy;
finalPos.z += 10.;

vPos = finalPos;
mvPosition = modelViewMatrix * vec4(vec3(finalPos), 1.);
gl_Position = projectionMatrix * mvPosition;