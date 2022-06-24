// Dark theme here; https://colorhunt.co/palette/222831393e46ffd369eeeeee

import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#fff",
  fontColor: "black",
  linkColor: "#11468F",
  titleColor: "black",
  navColor: "black",
  svgFilter: "invert(0%)",
  secondaryBackground: "whitesmoke",
  buttonFontColor: "white",
};

export const darkTheme = {
  body: "#222831",
  fontColor: "#EEEEEE",
  linkColor: "#FFD369",
  titleColor: "#EEEEEE",
  navColor: "#FFD369",
  svgFilter: "invert(100%)",
  secondaryBackground: "#393E46",
  buttonFontColor: "#393E46",
};

export const GlobalStyles = createGlobalStyle`
	body {
		background-color: ${(props) => props.theme.body};
        color: ${(props) => props.theme.fontColor};
	}

    a{
        color: ${(props) => props.theme.linkColor}
    }
    .pageTitle{
        color: ${(props) => props.theme.titleColor}
    }
    .pageTitle:before{
        background-color: ${(props) => props.theme.titleColor}
    }
    .nav-link{
        color: ${(props) => props.theme.navColor}
    }
    .social-svg {
        -webkit-filter: ${(props) => props.theme.svgFilter}
        filter: ${(props) => props.theme.svgFilter}
    }
    .nav-link::before {
        background-color: ${(props) => props.theme.navColor};
    }
    .navbar-light .navbar-nav .nav-link {
        color: ${(props) => props.theme.navColor};
    }
    .navbar-light .navbar-nav .nav-link:hover {
        color: ${(props) => props.theme.navColor};
      }
    .card{
        background-color: ${(props) => props.theme.body};
        border-color: ${(props) => props.theme.fontColor};
    }
    .footer{
        background-color: ${(props) => props.theme.secondaryBackground}
    }
    .btn-primary{
        background-color: ${(props) => props.theme.linkColor};
        border-color: ${(props) => props.theme.linkColor};
        color: ${(props) => props.theme.buttonFontColor}
    }
    .btn-primary:hover{
        background-color: ${(props) => props.theme.linkColor};
        border-color: ${(props) => props.theme.linkColor};
        color: ${(props) => props.theme.buttonFontColor};
    }
    .btn-outline-primary{
        color: ${(props) => props.theme.linkColor};
        border-color: ${(props) => props.theme.linkColor};
    }
    .btn-outline-primary:hover{
        background-color: ${(props) => props.theme.linkColor};
        border-color: ${(props) => props.theme.linkColor};
        color: ${(props) => props.theme.secondaryBackground};
    }
    .post-content{
        background-color: ${(props) => props.theme.secondaryBackground};
        border-color: ${(props) => props.theme.body}
    }
    .blogTitleLink{
        color: ${(props) => props.theme.fontColor};
    }
    .navbar-light .navbar-toggler-icon {
        filter: ${(props) => props.theme.svgFilter};
    }
    .header{
        background-color: ${(props) => props.theme.body};
    }
`;
