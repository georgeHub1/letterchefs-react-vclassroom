const Color = {
	hex: {
		blue: '#0a0631',
		liberty: '#5057ed',
		grape: '#993cd0', //'#9e66bf',
		grey: '#2a2a39',
		purple: '#712f79ff',
		berry: '#844985ff',
		fuchsia: '#976391ff',
		lavender: '#af7189',
		rose: '#c77e80ff',
		atomic: '#f7996eff',
		tangerine: '#f8a27bff',
		salmon: '#f9aa87ff',
		green: '#27AE60',
	},
	hsl: {
		blue: 'hsla(221, 37%, 45%, 1)',
		liberty: 'hsla(240, 35%, 46%, 1)',
		grape: 'hsla(158,102,191, 1)',
		purple: 'hsla(294, 44%, 33%, 1)',
		berry: 'hsla(299, 29%, 40%, 1)',
		fuchsia: 'hsla(299, 29%, 40%, 1)',
		lavender: 'hsla(337, 28%, 56%, 1)',
		rose: 'hsla(358, 39%, 64%, 1)',
		atomic: 'hsla(19, 90%, 70%, 1)',
		tangerine: 'hsla(19, 90%, 70%, 1)',
		salmon: 'hsla(18, 90%, 75%, 1)',
	},
	rgb: {
		blue: 'rgba(72, 99, 156, 1)',
		liberty: 'rgba(76, 76, 157, 1)',
		grape: 'rgba(158,102,191, 1)',
		purple: 'rgba(113, 47, 121, 1)',
		berry: 'rgba(132, 73, 133, 1)',
		fuchsia: 'rgba(151, 99, 145, 1)',
		lavender: 'rgba(175, 113, 137, 1)',
		rose: 'rgba(199, 126, 128, 1)',
		atomic: 'rgba(247, 153, 110, 1)',
		tangerine: 'rgba(248, 162, 123, 1)',
		salmon: 'rgba(249, 170, 135, 1)',
	},
	gradient: {
		top:
			'linear-gradient(0deg, #48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
		right:
			'linear-gradient(90deg, #48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
		bottom:
			'linear-gradient(180deg, #48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
		left:
			'linear-gradient(270deg, #48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
		'top-right':
			'linear-gradient(45deg, #48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
		'bottom-right':
			'linear-gradient(135deg, #48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
		'top-left':
			'linear-gradient(225deg, #48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
		'bottom-left':
			'linear-gradient(315deg, #48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
		radial:
			'radial-gradient(#48639cff, #4c4c9dff, #9e66bf, #712f79ff, #844985ff, #976391ff, #c77e80ff, #f7996eff, #f8a27bff, #f9aa87ff)',
	},
	ombre: {
		blue: `-webkit-radial-gradient(center, circle cover, #48639cff 0%, #4c4c9dff 100%)`,
		grey: `-webkit-radial-gradient(center, circle cover,  #333333 0%, #202124 100%)`,
		tangerine: `-webkit-radial-gradient(center, circle cover, #f8a27bff 0%, #af7189 100%)`,
		purple: `-webkit-radial-gradient(center, circle cover, #9e66bf 0%, #976391ff 100%)`,
		sunset: 'linear-gradient(rgba(249, 170, 135, 0.6), rgba(113, 47, 121, 0.6))',
		fog: 'linear-gradient(rgba(72, 99, 156, 0.6), rgba(158,102,191, 0.6))',
	},
};

export default Color;
