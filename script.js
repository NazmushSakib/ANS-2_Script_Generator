
window.addEventListener('load', function () {
  const form = document.getElementById('text-form');
  const container = document.getElementById('clipboard-container');
  const template = document.getElementById('clipboard-template');
  
  const uacSelectElement = document.getElementById('UAC');
  const sbcSelectElement = document.getElementById('SBC');
    uacSelectElement.addEventListener('change',(event)=>{
      const UAC = event.target.value;
      console.log('Selected UAC from Inside:' + UAC);
      const selectedUAC = getUAC(UAC);
      console.log(selectedUAC);
    })
    sbcSelectElement.addEventListener('change',(event)=>{
      const SBC = event.target.value;
      console.log(`Selected ISBC: ${SBC}`);
    })

    
    // console.log('from outside'+ SBC);
  function getUAC(UAC){
    const mogUacValue = {
      uacIpForSBC:"10.70.9.178"
    }
    const rmnUacValue = {
      uacIpForSBC:"10.70.1.178"
    }
    if(UAC=='mogUAC'){
      return mogUacValue;
    }
    else{
       return rmnUacValue;
    }
  }  
      
    
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const signalIP = document.getElementById('signalIP').value.trim()
    const tgName = document.getElementById('TG-name').value.trim()
    const TGnumber = document.getElementById('TGnum').value.trim()
    const mediaIP = document.getElementById('mediaIP').value.trim()
    const mediaMask = document.getElementById('mediaMask').value.trim()
    const externalTGport = document.getElementById('externalTGport').value.trim();
    const internaLocalPort = document.getElementById('internaLocalPort').value.trim();
    const internaPeerPortForUAC = document.getElementById('internaPeerPortForUAC').value.trim();

    const uacLocalServerPort = document.getElementById('uacLocalPort').value.trim();
    const remoteOsuPort = document.getElementById('osuPort').value.trim();
    const prefix = document.getElementById('prefix').value.trim();
    const maxNumberLength = document.getElementById('maxNumberLength').value.trim();
    const minNumberLength = document.getElementById('minNumberLength').value.trim();

    
    const texts = [
      {
        title: 'ISBC side commands',
        topic: 'Step 1: ADD Signaling IP',
        code: `ADD IPRT:TY=STATIC,IPTYPE1=IPV4,IP="${signalIP}",MSK="255.255.255.255",GATE="10.70.9.97",VRFFLAG=Y,VRFNAME="VRF_Interworking",PRE=60,DESC="to_${tgName}_signaling";`
      },
      {
        title: '',
        topic: 'Step 2: ADD Media IP',
        code: `ADD IPRT:TY=STATIC,IPTYPE1=IPV4,IP="${mediaIP}",MSK="${mediaMask}",GATE="10.70.9.1",VRFFLAG=Y,VRFNAME="VRF_Interworking",PRE=60,DESC="To_${tgName}_media";`,
      },
      {
        title: '',
        topic: 'Step 3: ADD ISIPTG for Peer SBC',
        code: `ADD ISIPTG:TGNAME="${tgName}_TG",TGTYPE=COMMON_TRUNK,LINKINFO=UDP,LADDRN="MOG-External-1",LPORT=${externalTGport},PIPTYPE=IPV4,PIPV4="${signalIP}",PPORT=${externalTGport},MEDDN="MOG-External-Media",MIPTYPEP=IPV4,CHB=HRHB,MATD=N,COPTDETECTION=N,FROUTING=N,PRCFGDATA=N,RNIT="${tgName}_To_mogUAC",CICDELFLAG=N,SIGPLCNAME="DEFAULTIBCFSIGPLC",BCPLCNAME="DEFAULTIBCFBCPLC",TCCAPNAME="MOG-IBCF-TCCAP",OPTATRSP=N,SITYPE=SIP,SOTYPE=SIP,TP="DefaultPolicy",TKNC=K'EEEEEE,SCPR=N,CRNA=TRANS,CNA=TRANS,QRYITNPORT=Y,ADDTGRP=N,INNC=N,OUTNC=N,SETQOSTH=N,HIDINTGN=N,NUMPLCTYPE=COMMON,UNPLC=NULL,CALLEDNPLC=NULL,MOG="PUBLIC",CLEARMODEPTIME=PTIME_20,NCRSP=NULL,SIPPSTNXMLFLG=N,ENMXML=N,ENCXML=N,ESIPICFG=N,ENRFCHG=BIDIRECTIONAL,CICPLC=NULL,DOMHID=NULL,TGRPCHG=DELTGRPINREQURI-0&DELTGRPINCONTACT-0&ADDTGRPINCONTACT-0,OUTTGDNTYPE=IMS_DN,FTVOLTECODE=N,ISREFRESHOLVER=N,RESERVED1=0,RESERVED2=0,RESERVED3=0,RESERVED4=0;`
      },
      {
        title: '',
        topic: 'Step 4: ADD ISIPTG for our UAC',
        code: `ADD ISIPTG:TGNAME="mogUAC_${tgName}_TG",TGTYPE=COMMON_TRUNK,LINKINFO=UDP,LADDRN="MOG-Internal-1",LPORT=${internaLocalPort},PIPTYPE=IPV4,PIPV4="10.70.9.178",PPORT=${internaPeerPortForUAC},MEDDN="MOG-Internal-Media",MIPTYPEP=IPV4,CHB=HRHB,MATD=N,COPTDETECTION=N,FROUTING=N,PRCFGDATA=N,RNIT="mogUAC_To_${tgName}",CICDELFLAG=N,SIGPLCNAME="DEFAULTIBCFSIGPLC",BCPLCNAME="DEFAULTIBCFBCPLC",TCCAPNAME="MOG-IBCF-TCCAP",OPTATRSP=N,SITYPE=SIP,SOTYPE=SIP,TP="DefaultPolicy",TKNC=K'EEEEEE,SCPR=N,CRNA=TRANS,CNA=TRANS,QRYITNPORT=N,ADDTGRP=N,INNC=N,OUTNC=N,SETQOSTH=N,HIDINTGN=N,NUMPLCTYPE=COMMON,UNPLC=NULL,CALLEDNPLC=NULL,MOG="PUBLIC",CLEARMODEPTIME=PTIME_20,NCRSP=NULL,SIPPSTNXMLFLG=N,ENMXML=N,ENCXML=N,ESIPICFG=N,ENRFCHG=BIDIRECTIONAL,CICPLC=NULL,DOMHID=NULL,TGRPCHG=DELTGRPINREQURI-0&DELTGRPINCONTACT-0&ADDTGRPINCONTACT-0,OUTTGDNTYPE=IMS_DN,FTVOLTECODE=N,ISREFRESHOLVER=N,RESERVED1=0,RESERVED2=0,RESERVED3=0,RESERVED4=0;`
      },
      {
        title: '',
        topic: 'Step 5: ADD IOFC for Peer SBC',
        code: `ADD IOFC:OFCNAME="${tgName}_to_mogUAC_OFC",TG1NAME="mogUAC_${tgName}_TG",PTG1=100,WTG1=10,PTG2=100,WTG2=10,PTG3=100,WTG3=10,PTG4=100,WTG4=10,PTG5=100,WTG5=10,PTG6=100,WTG6=10,PTG7=100,WTG7=10,PTG8=100,WTG8=10,PTG9=100,WTG9=10,PTG10=100,WTG10=10,PTG11=100,WTG11=10,PTG12=100,WTG12=10,PTG13=100,WTG13=10,PTG14=100,WTG14=10,PTG15=100,WTG15=10,PTG16=100,WTG16=10,LATGNUM=1,RESELTG=N,MOG="PUBLIC",RESERVED1=0,RESERVED2=0,RESERVED3=0,RESERVED4=0;`
      },
      {
        title: '',
        topic: 'Step 6: ADD IOFC for our UAC',
        code: `ADD IOFC:OFCNAME="mogUAC_to_${tgName}_OFC",TG1NAME="${tgName}_TG",PTG1=100,WTG1=10,PTG2=100,WTG2=10,PTG3=100,WTG3=10,PTG4=100,WTG4=10,PTG5=100,WTG5=10,PTG6=100,WTG6=10,PTG7=100,WTG7=10,PTG8=100,WTG8=10,PTG9=100,WTG9=10,PTG10=100,WTG10=10,PTG11=100,WTG11=10,PTG12=100,WTG12=10,PTG13=100,WTG13=10,PTG14=100,WTG14=10,PTG15=100,WTG15=10,PTG16=100,WTG16=10,LATGNUM=1,RESELTG=N,MOG="PUBLIC",RESERVED1=0,RESERVED2=0,RESERVED3=0,RESERVED4=0;`
      },
      {
        title: '',
        topic: 'Step 7: ADD IRT for Peer SBC',
        code: `ADD IRT: RTNAME="${tgName}_IRT", SOPLY=AUTO, SBPLY=AUTO, RTTYPE=STATIC, OFC1NAME="${tgName}_to_mogUAC_OFC", POFC1=10, WOFC1=10, POFC2=10, WOFC2=10, POFC3=100, WOFC3=10, POFC4=100, WOFC4=10, POFC5=100, WOFC5=10, POFC6=100, WOFC6=10, POFC7=100, WOFC7=10, POFC8=100, WOFC8=10, POFC9=100, WOFC9=10, POFC10=100, WOFC10=10, POFC11=100, WOFC11=10, POFC12=100, WOFC12=10, POFC13=100, WOFC13=10, POFC14=100, WOFC14=10, POFC15=100, WOFC15=10, POFC16=100, WOFC16=10, SNOT="${tgName}_To_mogUAC", CICDELFLAG=N, RESELOFC=N, LAOFCNUM=1, EXTPLC=NULL, MOG="PUBLIC", RRTYPE=IP, RESERVED1=0, RESERVED2=0, RESERVED3=0, RESERVED4=0;`
      },
      {
        title: '',
        topic: 'Step 8: ADD IRT for our UAC',
        code: `ADD IRT: RTNAME="mogUAC_${tgName}_IRT", SOPLY=AUTO, SBPLY=AUTO, RTTYPE=STATIC, OFC1NAME="mogUAC_to_${tgName}_OFC", POFC1=10, WOFC1=10, POFC2=10, WOFC2=10, POFC3=100, WOFC3=10, POFC4=100, WOFC4=10, POFC5=100, WOFC5=10, POFC6=100, WOFC6=10, POFC7=100, WOFC7=10, POFC8=100, WOFC8=10, POFC9=100, WOFC9=10, POFC10=100, WOFC10=10, POFC11=100, WOFC11=10, POFC12=100, WOFC12=10, POFC13=100, WOFC13=10, POFC14=100, WOFC14=10, POFC15=100, WOFC15=10, POFC16=100, WOFC16=10, SNOT="mogUAC_To_${tgName}", CICDELFLAG=N, RESELOFC=N, LAOFCNUM=1, EXTPLC=NULL, MOG="PUBLIC", RRTYPE=IP, RESERVED1=0, RESERVED2=0, RESERVED3=0, RESERVED4=0;`
      },
      {
        title: '',
        topic: 'Step 9: MOD DQI for external TG(Run before commercial call)',
        code: `MOD DQI:ENTYPE=IBCF,TGNAME="${tgName}_TG",VIDBW=415662,AUDBW=96000,APPBW=384000,DATBW=384000,CTRBW=8000,MSGDBW=1024000,DIBW=111000,DTBW=64000,DOBW=64000,MVIDBW=2097152,MAUDBW=356160,MAPPBW=806400,MDATBW=806400,MCTRBW=16800,MMSGBW=2048000,MIBW=134400,MTBW=134400,MOBW=134400,MMEDBW=4000000000,VIDDDSCP=0,AUDDDSCP=0,APPDDSCP=0,DATDDSCP=0,CTRDDSCP=0,MSGDDSCP=0,TXTDDSCP=0,IMGDDSCP=0,OTRDDSCP=0;`
      },
      {
        title: '',
        topic: 'Step 10: MOD DQI for internal TG(Run before commercial call)',
        code: `MOD DQI:ENTYPE=IBCF,TGNAME="mogUAC_${tgName}_TG",VIDBW=415662,AUDBW=96000,APPBW=384000,DATBW=384000,CTRBW=8000,MSGDBW=1024000,DIBW=111000,DTBW=64000,DOBW=64000,MVIDBW=2097152,MAUDBW=356160,MAPPBW=806400,MDATBW=806400,MCTRBW=16800,MMSGBW=2048000,MIBW=134400,MTBW=134400,MOBW=134400,MMEDBW=4000000000,VIDDDSCP=0,AUDDDSCP=0,APPDDSCP=0,DATDDSCP=0,CTRDDSCP=0,MSGDDSCP=0,TXTDDSCP=0,IMGDDSCP=0,OTRDDSCP=0;`
      },
      {
        title: 'UAC side commands',
        topic: 'Step:11: ADD CALLSRC & RSSC',
        code: `ADD CALLSRC: CSC=${TGnumber}, CSCNAME="${tgName}", LP=0, RSSC=${TGnumber};`
      },
      {
        title: '',
        topic: 'Step:12: ADD OFC',
        code: `ADD OFC: O=${TGnumber}, ON="${tgName}", DOT=CMPX, DOL=HIGH;`
      },
      {
        title: '',
        topic: 'Step:13: ADD SRT',
        code: `ADD SRT:SRC=${TGnumber},O=${TGnumber},SRN="${tgName}",RIN=65535,EI=0,CNC=CLD-0;`
      },
      {
        title: '',
        topic: 'Step:14: ADD RT',
        code: `ADD RT:R=${TGnumber},RN="${tgName}",IDTP=UNKWN,NAMECFG=,SNCM=SRT,SRST=SEQ,SRTPRI=LOW,SR1=${TGnumber},SANN=,STTP=INVALID;`
      },
      {
        title: '',
        topic: 'Step:15: ADD RTANA for RSC',
        code: `ADD RTANA: RAN="${tgName}", RSC=${TGnumber}, RSSC=${TGnumber}, TM=TMM, R=${TGnumber}, RN="${tgName}";`
      },
      {
        title: '',
        topic: 'Step:16: ADD SIPTG',
        code: `ADD SIPTG:TG=${TGnumber},CSC=${TGnumber},SRT=${TGnumber},TGN="${tgName}",RCHS=0,OTCS=65535,HCIC=5000,LCIC=5000,ST=NGNN,AA=YES,EA=YES,ICR=LCO-1&LC-1&LCT-1&NTT-1&ITT-1&INTT-1&IITT-1&IOLT-1&CCR1-0&CCR2-0&CCR3-0&CCR4-0&CCR5-0&CCR6-0&CCR7-0&CCR8-0&CCR9-0&CCR10-0&CCR11-0&CCR12-0&CCR13-0&CCR14-0&CCR15-0&CCR16-0,OCR=LCO-1&LC-1&LCT-1&NTT-1&ITT-1&INTT-1&IITT-1&IOLT-1&CCR1-0&CCR2-0&CCR3-0&CCR4-0&CCR5-0&CCR6-0&CCR7-0&CCR8-0&CCR9-0&CCR10-0&CCR11-0&CCR12-0&CCR13-0&CCR14-0&CCR15-0&CCR16-0,CRF=B0-0&B1-0,UHB=RMAL,SFPARA=SVR0-0&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-0&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-1&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,SFPARAS=SVR0-0&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-0&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-0&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,SFPARAT=SVR0-0&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-0&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-0&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,SGCTRL=SVR0-1&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-1&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-0&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,SGCTRLS=SVR0-0&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-0&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-0&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,SGCTRLT=SVR0-0&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-0&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-0&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,SGCTRLF=SVR0-0&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-0&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-0&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,SGCTRLFIF=SVR0-0&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-0&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-0&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,SGCTRLSIX=SVR0-0&SVR1-0&SVR2-0&SVR3-0&SVR4-0&SVR5-0&SVR6-0&SVR7-0&SVR8-0&SVR9-0&SVR10-0&SVR11-0&SVR12-0&SVR13-0&SVR14-0&SVR15-0&SVR16-0&SVR17-0&SVR18-0&SVR19-0&SVR20-0&SVR21-0&SVR22-0&SVR23-0&SVR24-0&SVR25-0&SVR26-0&SVR27-0&SVR28-0&SVR29-0&SVR30-0&SVR31-0,MST=SONST,SST=SINST,PL=PU,VIDEOS=NSUPPORT,CHBF=,CODECS=PCMA-1&PCMU-1&G7231-1&G726-1&G728-1&G729-1&MPEG4A-1&S2833-1&G726_40-1&G726_32-1&G726_24-1&G726_16-1&H261-1&H263-1&MPEG4V-1&H264-1&AMR_WB-1&T120-1&T38-1&AMR-1&CLEARMODE-1&ILBC-1&SPEEX-1&G722-1&GSM_FR-1,SELMODE=DIST,INROP=P0,IRCMFLAG=,ORCMFLAG=,SSF=" ",MDOMAINF=0;`
      },
      {
        title: '',
        topic: 'Step:17: ADD SIPIPPAIR',
        code: `ADD SIPIPPAIR:TG=${TGnumber},TGN="${tgName}",ADDRTYPE=IPV4,IMN=1701,LSRVP=${uacLocalServerPort},OSU="10.70.9.114:${remoteOsuPort}",MSTYPE-=MASTER,DH=,DELTECH=YES,PTYPE=UDP,USEREMOTEP=YES;`
      },
      {
        title: '',
        topic: 'Step:18: ADD CNACLD (Optional)',
        code: `ADD CNACLD: LP=0, PFX=K'${prefix}, CSTP=BASE, CSA=ITT, RSC=${TGnumber}, MINL=${minNumberLength}, MAXL=${maxNumberLength}, CHSC=0, EA=NO, SDESCRIPTION="${tgName}_call_test";`
      }
    ];
    texts.forEach((text, index) => {

      const clone = template.content.cloneNode(true);

      const textarea = clone.querySelector('.clipboard-text');
      const copyButton = clone.querySelector('.copy-btn');
      const defaultMsg = clone.querySelector('.default-message');
      const successMsg = clone.querySelector('.success-message');
      const topic = clone.querySelector('.topic');
      const title = clone.querySelector('.title');

      title.innerText = text.title;
      topic.innerText = text.topic;
      textarea.value = text.code;

      // copy button reposition after adding title
      if(text.title){
        copyButton.classList.add('top-24')
      }
      else{
        copyButton.classList.add('top-12')
      }

      //copy function
      copyButton.addEventListener('click', () => {

        navigator.clipboard.writeText(textarea.value);

        // Show success
        defaultMsg.classList.add('hidden');
        successMsg.classList.remove('hidden');

        // Reset after 2 sec
/*        
        setTimeout(() => {
          defaultMsg.classList.remove('hidden');
          successMsg.classList.add('hidden');
        }, 2000);
*/
      });
      container.appendChild(clone);
      
      //clear input


    });
    const inputFields = ['signalIP', 'TG-name', 'TGnum', 'mediaIP', 'mediaMask','externalTGport','internaLocalPort','internaPeerPortForUAC','uacLocalPort','osuPort','prefix','maxNumberLength','minNumberLength'];
    inputFields.forEach((x)=>{
      document.getElementById(x).value = '';
    })
  })

});