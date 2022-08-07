interface ITelegramApp
{
    initDataUnsafe?: 
    {
        user?: {
            first_name?: string,
            id: number,
            last_name?: string,
            language_code?: string
        }
    }
}

interface IWindowTelegramApp
{
	Telegram?:
	{
		WebApp: ITelegramApp;
	}
}


let telegramApp: ITelegramApp | null = null;

if (window)
{
	const tg = (window as IWindowTelegramApp).Telegram;
	if (tg && tg.WebApp)
	{
		telegramApp = tg.WebApp;
	}
}

console.log(telegramApp);

export function getTelegramWebApp(): ITelegramApp | null
{
    return telegramApp;
}