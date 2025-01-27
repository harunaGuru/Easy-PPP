import { clientEnv } from "@/data/env/client";


export  function Banner({canRemoveBranding, message, mappings, customization}:{
  canRemoveBranding:boolean | undefined;
   message:string;
   mappings:{
    coupon: string,
    country: string,
    discount: string
   },
   customization:{
    backgroundColor: string;
    classPrefix: string | null;
    locationMessage: string;
    fontSize: string;
    textColor: string;
    isSticky: boolean;
},
}) {
    
    const prefix = customization.classPrefix ?? ""
    const mappedValue = Object.entries(mappings).reduce((mapped, [key, value])=>{
      // (`{${key}}`, value)
      return mapped.replace(new RegExp(`{${key}}`, "g"), value)  
    }, message.replace(/'/g, "&#39;"))
    return (
      <>
      <style type="text/css">
        {`
          .${prefix}easy-ppp-container {
            all: revert;
            display: flex;
            flex-direction: column;
            gap: .5em;
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            font-size: ${customization.fontSize};
            font-family: inherit;
            padding: 1rem;
            ${customization.isSticky ? "position: sticky;" : ""}
            left: 0;
            right: 0;
            top: 0;
            text-wrap: balance;
            text-align: center;
          }
          
          .${prefix}easy-ppp-branding {
            color: inherit;
            font-size: inherit;
            display: inline-block;
            text-decoration: underline;
          }
          `}
      </style>

      <div className={`${prefix}easy-ppp-container ${prefix}easy-ppp-override`}>
        <span 
        className={`${prefix}easy-ppp-message ${prefix}easy-ppp-override`} 
        dangerouslySetInnerHTML={{
          __html: mappedValue
          }} 
          /> 

        {!canRemoveBranding && (
          <a
            className={`${prefix}easy-ppp-branding`}
            href={`${clientEnv.NEXT_PUBLIC_APP_URL}`}
          >
            Powered by Easy PPP
          </a>
        )}
      </div>
      </>
  )
}

