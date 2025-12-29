// Referral Utilities
export const getReferralCodeFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
};

export const getInviteCodeFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('invite');
};

// Store referral/invite codes in session storage when user arrives
export const storeReferralInfo = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = getReferralCodeFromURL();
  const inviteCode = getInviteCodeFromURL();
  
  console.log('🔍 Checking URL for referral info:', {
    fullURL: window.location.href,
    searchParams: window.location.search,
    parsedRef: urlParams.get('ref'),
    parsedInvite: urlParams.get('invite'),
    extractedReferralCode: referralCode,
    extractedInviteCode: inviteCode
  });
  
  if (referralCode) {
    sessionStorage.setItem('referralCode', referralCode);
    console.log('✅ Stored referral code:', referralCode);
  } else {
    console.log('❌ No referral code found in URL');
  }
  
  if (inviteCode) {
    sessionStorage.setItem('inviteCode', inviteCode);
    console.log('✅ Stored invite code:', inviteCode);
  } else {
    console.log('❌ No invite code found in URL');
  }
};

// Retrieve stored referral/invite codes
export const getStoredReferralCode = () => {
  return sessionStorage.getItem('referralCode');
};

export const getStoredInviteCode = () => {
  return sessionStorage.getItem('inviteCode');
};

// Clear stored codes after successful registration
export const clearStoredReferralInfo = () => {
  sessionStorage.removeItem('referralCode');
  sessionStorage.removeItem('inviteCode');
};

// Check if user arrived via referral or invite
export const hasReferralInfo = () => {
  return !!(getStoredReferralCode() || getStoredInviteCode());
};