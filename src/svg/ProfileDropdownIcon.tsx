const ProfileDropdownIcon = ({fill}:any) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx={10} cy={10} r={9.5} fill="white" stroke="#2C3F58"/>
            <mask id="mask0_30_968" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x={5} y={6} width={10} height={10}>
                <rect width={10} height={10} transform="matrix(0 1 1 0 5 6)" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_30_968)">
                <path d="M14.1667 9.34375L13.4271 8.60417L10 12.0313L6.57296 8.60417L5.83337 9.34375L10 13.5104L14.1667 9.34375Z" fill={fill}/>
            </g>
        </svg>
    )
}

export default ProfileDropdownIcon;