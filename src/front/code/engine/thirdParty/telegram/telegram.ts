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
    ready: () => void;
    expand: () => void;
    close: () => void;
    onEvent: (name: string, callback: (...args: any) => void) => void;
    isExpanded: boolean;
    enableClosingConfirmation: () => void;
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

        telegramApp.onEvent('viewportChanged', (event) =>
        {
            const isExpanded = telegramApp ? telegramApp.isExpanded : null;
            if (isExpanded == false && telegramApp)
            {
                telegramApp.expand();
            }
        })
	}
}

console.log(telegramApp);

export function getTelegramWebApp(): ITelegramApp | null
{
    return telegramApp;
}
