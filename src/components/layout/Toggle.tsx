import { useTheme } from 'next-themes';
import { MdSunny } from "react-icons/md";
import { BsFillMoonStarsFill } from "react-icons/bs";

interface ToggleProps {
    theme: string | undefined;
}

const Toggle = ({ theme }: ToggleProps) => {
    const {setTheme} = useTheme();
    return( 
        <div className="top-8 right-8 fixed flex flex-col justify-center items-center p-2 z-50 bg-black/30 dark:bg-white/10 hover:bg-black/70 hover:dark:bg-white/30 hover:scale-105 duration-200 rounded-full" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            <MdSunny className="hidden dark:block text-xl" />
            <BsFillMoonStarsFill className="dark:hidden text-xl" />
        </div>
    )
}

export default Toggle;