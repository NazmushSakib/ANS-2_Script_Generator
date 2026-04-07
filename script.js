
window.addEventListener('load', function () {
  const form = document.getElementById('text-form');
  const container = document.getElementById('clipboard-container');
  const template = document.getElementById('clipboard-template');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const signalIP = document.getElementById('signalIP').value.trim()
    const tgName = document.getElementById('TG-name').value.trim()

    const mediaIP = document.getElementById('mediaIP').value.trim()
    const mediaMask = document.getElementById('mediaMask').value.trim()
    const externalPort = document.getElementById('externalPort').value.trim();
    const internalPort = document.getElementById('internalPort').value.trim();

    const texts = [
      {
        topic: 'Step 1: ADD Signaling IP',
        code: `ADD IPRT:TY=STATIC,IPTYPE1=IPV4,IP="${signalIP}",MSK="255.255.255.255",GATE="10.70.9.97",VRFFLAG=Y,VRFNAME="VRF_Interworking",PRE=60,DESC="to_${tgName}_signaling";`
      },
      {
        topic: 'Step 2: ADD Media IP',
        code: `ADD IPRT:TY=STATIC,IPTYPE1=IPV4,IP="${mediaIP}",MSK="${mediaMask}",GATE="10.70.9.1",VRFFLAG=Y,VRFNAME="VRF_Interworking",PRE=60,DESC="To_${tgName}_media";`,
      },
      {
        topic: 'Step 3: ADD ISIPTG for Peer SBC',
        code: `ADD ISIPTG:TGNAME="${tgName}_TG",TGTYPE=COMMON_TRUNK,LINKINFO=UDP,LADDRN="MOG-External-1",LPORT=${externalPort},PIPTYPE=IPV4,PIPV4="${signalIP}",PPORT=${externalPort},MEDDN="MOG-External-Media",MIPTYPEP=IPV4,CHB=HRHB,MATD=N,COPTDETECTION=N,FROUTING=N,PRCFGDATA=N,RNIT="${tgName}_To_mogUAC",CICDELFLAG=N,SIGPLCNAME="DEFAULTIBCFSIGPLC",BCPLCNAME="DEFAULTIBCFBCPLC",TCCAPNAME="MOG-IBCF-TCCAP",OPTATRSP=N,SITYPE=SIP,SOTYPE=SIP,TP="DefaultPolicy",TKNC=K'EEEEEE,SCPR=N,CRNA=TRANS,CNA=TRANS,QRYITNPORT=Y,ADDTGRP=N,INNC=N,OUTNC=N,SETQOSTH=N,HIDINTGN=N,NUMPLCTYPE=COMMON,UNPLC=NULL,CALLEDNPLC=NULL,MOG="PUBLIC",CLEARMODEPTIME=PTIME_20,NCRSP=NULL,SIPPSTNXMLFLG=N,ENMXML=N,ENCXML=N,ESIPICFG=N,ENRFCHG=BIDIRECTIONAL,CICPLC=NULL,DOMHID=NULL,TGRPCHG=DELTGRPINREQURI-0&DELTGRPINCONTACT-0&ADDTGRPINCONTACT-0,OUTTGDNTYPE=IMS_DN,FTVOLTECODE=N,ISREFRESHOLVER=N,RESERVED1=0,RESERVED2=0,RESERVED3=0,RESERVED4=0;`
      },
      {
        topic: 'Step 4: ADD ISIPTG for our UAC',
        code: `ADD ISIPTG:TGNAME="mogUAC_${tgName}_TG",TGTYPE=COMMON_TRUNK,LINKINFO=UDP,LADDRN="MOG-Internal-1",LPORT=${internalPort},PIPTYPE=IPV4,PIPV4="10.70.9.178",PPORT=${internalPort},MEDDN="MOG-Internal-Media",MIPTYPEP=IPV4,CHB=HRHB,MATD=N,COPTDETECTION=N,FROUTING=N,PRCFGDATA=N,RNIT="mogUAC_To_${tgName}",CICDELFLAG=N,SIGPLCNAME="DEFAULTIBCFSIGPLC",BCPLCNAME="DEFAULTIBCFBCPLC",TCCAPNAME="MOG-IBCF-TCCAP",OPTATRSP=N,SITYPE=SIP,SOTYPE=SIP,TP="DefaultPolicy",TKNC=K'EEEEEE,SCPR=N,CRNA=TRANS,CNA=TRANS,QRYITNPORT=N,ADDTGRP=N,INNC=N,OUTNC=N,SETQOSTH=N,HIDINTGN=N,NUMPLCTYPE=COMMON,UNPLC=NULL,CALLEDNPLC=NULL,MOG="PUBLIC",CLEARMODEPTIME=PTIME_20,NCRSP=NULL,SIPPSTNXMLFLG=N,ENMXML=N,ENCXML=N,ESIPICFG=N,ENRFCHG=BIDIRECTIONAL,CICPLC=NULL,DOMHID=NULL,TGRPCHG=DELTGRPINREQURI-0&DELTGRPINCONTACT-0&ADDTGRPINCONTACT-0,OUTTGDNTYPE=IMS_DN,FTVOLTECODE=N,ISREFRESHOLVER=N,RESERVED1=0,RESERVED2=0,RESERVED3=0,RESERVED4=0;`
      },
      {
        topic: 'Step 5: ADD IOFC for Peer SBC',
        code: `ADD IOFC:OFCNAME="${tgName}_mogUAC_OFC",TG1NAME="mogUAC_${tgName}_TG",PTG1=100,WTG1=10,PTG2=100,WTG2=10,PTG3=100,WTG3=10,PTG4=100,WTG4=10,PTG5=100,WTG5=10,PTG6=100,WTG6=10,PTG7=100,WTG7=10,PTG8=100,WTG8=10,PTG9=100,WTG9=10,PTG10=100,WTG10=10,PTG11=100,WTG11=10,PTG12=100,WTG12=10,PTG13=100,WTG13=10,PTG14=100,WTG14=10,PTG15=100,WTG15=10,PTG16=100,WTG16=10,LATGNUM=1,RESELTG=N,MOG="PUBLIC",RESERVED1=0,RESERVED2=0,RESERVED3=0,RESERVED4=0;`
      },
      {
        topic: 'Step 6: ADD IOFC for our UAC',
        code: `ADD IOFC:OFCNAME="mogUAC_to_${tgName}_OFC",TG1NAME="${tgName}_TG",PTG1=100,WTG1=10,PTG2=100,WTG2=10,PTG3=100,WTG3=10,PTG4=100,WTG4=10,PTG5=100,WTG5=10,PTG6=100,WTG6=10,PTG7=100,WTG7=10,PTG8=100,WTG8=10,PTG9=100,WTG9=10,PTG10=100,WTG10=10,PTG11=100,WTG11=10,PTG12=100,WTG12=10,PTG13=100,WTG13=10,PTG14=100,WTG14=10,PTG15=100,WTG15=10,PTG16=100,WTG16=10,LATGNUM=1,RESELTG=N,MOG="PUBLIC",RESERVED1=0,RESERVED2=0,RESERVED3=0,RESERVED4=0;`
      },
      {
        topic: 'Step 7: ADD IRT for Peer SBC',
        code: `ADD IRT: RTNAME="${tgName}_IRT", SOPLY=AUTO, SBPLY=AUTO, RTTYPE=STATIC, OFC1NAME="${tgName}_to_mogUAC_OFC", POFC1=10, WOFC1=10, POFC2=10, WOFC2=10, POFC3=100, WOFC3=10, POFC4=100, WOFC4=10, POFC5=100, WOFC5=10, POFC6=100, WOFC6=10, POFC7=100, WOFC7=10, POFC8=100, WOFC8=10, POFC9=100, WOFC9=10, POFC10=100, WOFC10=10, POFC11=100, WOFC11=10, POFC12=100, WOFC12=10, POFC13=100, WOFC13=10, POFC14=100, WOFC14=10, POFC15=100, WOFC15=10, POFC16=100, WOFC16=10, SNOT="${tgName}_To_mogUAC", CICDELFLAG=N, RESELOFC=N, LAOFCNUM=1, EXTPLC=NULL, MOG="PUBLIC", RRTYPE=IP, RESERVED1=0, RESERVED2=0, RESERVED3=0, RESERVED4=0;`
      },
      {
        topic: 'Step 8: ADD IRT for our UAC',
        code: `ADD IRT: RTNAME="mogUAC_${tgName}_IRT", SOPLY=AUTO, SBPLY=AUTO, RTTYPE=STATIC, OFC1NAME="mogUAC_to_${tgName}_OFC", POFC1=10, WOFC1=10, POFC2=10, WOFC2=10, POFC3=100, WOFC3=10, POFC4=100, WOFC4=10, POFC5=100, WOFC5=10, POFC6=100, WOFC6=10, POFC7=100, WOFC7=10, POFC8=100, WOFC8=10, POFC9=100, WOFC9=10, POFC10=100, WOFC10=10, POFC11=100, WOFC11=10, POFC12=100, WOFC12=10, POFC13=100, WOFC13=10, POFC14=100, WOFC14=10, POFC15=100, WOFC15=10, POFC16=100, WOFC16=10, SNOT="mogUAC_To_${tgName}", CICDELFLAG=N, RESELOFC=N, LAOFCNUM=1, EXTPLC=NULL, MOG="PUBLIC", RRTYPE=IP, RESERVED1=0, RESERVED2=0, RESERVED3=0, RESERVED4=0;`
      },
      {
        topic: 'Step 9: MOD DQI for external TG(Run before starting commercial call)',
        code: `MOD DQI:ENTYPE=IBCF,TGNAME="${tgName}_TG",VIDBW=415662,AUDBW=96000,APPBW=384000,DATBW=384000,CTRBW=8000,MSGDBW=1024000,DIBW=111000,DTBW=64000,DOBW=64000,MVIDBW=2097152,MAUDBW=356160,MAPPBW=806400,MDATBW=806400,MCTRBW=16800,MMSGBW=2048000,MIBW=134400,MTBW=134400,MOBW=134400,MMEDBW=4000000000,VIDDDSCP=0,AUDDDSCP=0,APPDDSCP=0,DATDDSCP=0,CTRDDSCP=0,MSGDDSCP=0,TXTDDSCP=0,IMGDDSCP=0,OTRDDSCP=0;`
      },
      {
        topic: 'Step 10: MOD DQI for internal TG(Run before starting commercial call)',
        code: `MOD DQI:ENTYPE=IBCF,TGNAME="mogUAC_${tgName}_TG",VIDBW=415662,AUDBW=96000,APPBW=384000,DATBW=384000,CTRBW=8000,MSGDBW=1024000,DIBW=111000,DTBW=64000,DOBW=64000,MVIDBW=2097152,MAUDBW=356160,MAPPBW=806400,MDATBW=806400,MCTRBW=16800,MMSGBW=2048000,MIBW=134400,MTBW=134400,MOBW=134400,MMEDBW=4000000000,VIDDDSCP=0,AUDDDSCP=0,APPDDSCP=0,DATDDSCP=0,CTRDDSCP=0,MSGDDSCP=0,TXTDDSCP=0,IMGDDSCP=0,OTRDDSCP=0;`
      },
    ];
    texts.forEach((text, index) => {

      const clone = template.content.cloneNode(true);

      const textarea = clone.querySelector('.clipboard-text');
      const button = clone.querySelector('.copy-btn');
      const defaultMsg = clone.querySelector('.default-message');
      const successMsg = clone.querySelector('.success-message');
      const topic = clone.querySelector('.topic');

      topic.innerText = text.topic;
      textarea.value = text.code;

      //copy function
      button.addEventListener('click', () => {

        navigator.clipboard.writeText(textarea.value);

        // Show success
        defaultMsg.classList.add('hidden');
        successMsg.classList.remove('hidden');

        // Reset after 2 sec
        setTimeout(() => {
          defaultMsg.classList.remove('hidden');
          successMsg.classList.add('hidden');
        }, 2000);

      });

      container.appendChild(clone);

    });

  })

});