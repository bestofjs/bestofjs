const bestofjsOrange = '#e65100'
const bestofjsPurple = '#9E0142'
const textSecondaryColor = '#777'

const buttonStyles = props => `
display: inline-block;
color: #fff;
background-color: ${bestofjsOrange};
padding: 10px 15px;
border-radius: 6px;
transition: all 0.3s;
border: none;
font-size: 1rem;
&.disabled {
  opacity: 0.5;
}
&:hover:not(.disabled) {
  text-decoration: none;
  color: white;
  background-color: ${bestofjsPurple};
  cursor: pointer;
}
&.block {
  display: block;
  text-align: center;
  width: 100%;
}
&.button-outline {
  background-color: #fff;
  border: 1px solid ${bestofjsOrange};
  color: ${bestofjsOrange};
}
&.button-outline:hover {
  color: #fff;
  background-color: ${bestofjsOrange};
}
&.button-outline.light {
  color: ${textSecondaryColor};
  border-color: ${textSecondaryColor};
}
&.button-outline.light:hover {
  color: #fff;
  background-color: ${textSecondaryColor};
}
.icon {
  margin-right: 0.5rem;
}
`
export default buttonStyles
