"use client";

import { useEffect, useState } from "react";
import { rest } from "@/lib/rest";
import Script from "next/script";

export default function IntercomWidget() {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const getIntercomId = async () => {
      try {
        const res = await rest(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/intercom`,
          {},
          {
            method: "GET",
          }
        );

        if (res.totalDocs > 0) {
          setId(res.docs[0].intercom_id);
        }
      } catch (error) {
        console.error("Error fetching Intercom ID:", error);
      }
    };

    getIntercomId();
  }, []);

  return (
    <>
      {id.length > 0 && (
        <Script
          id="intercom-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
          window.intercomSettings = {
            api_base: "https://api-iam.intercom.io",
            hide_default_launcher: false,
            app_id: "${id || ""}",
          };
          (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${
            id || ""
          }';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
        `,
          }}
        />
      )}
    </>
  );
}
