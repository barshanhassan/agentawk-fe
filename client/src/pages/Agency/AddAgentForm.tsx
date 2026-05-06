import React from 'react';
import { Users, Info, AlertTriangle, Globe, User, Shield, Mail, Phone, MessageCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search, Check } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslation } from 'react-i18next';

const countries = [
  { name: "Afghanistan", code: "AF", dial: "+93", placeholder: "70 123 4567" },
  { name: "Albania", code: "AL", dial: "+355", placeholder: "67 123 4567" },
  { name: "Algeria", code: "DZ", dial: "+213", placeholder: "512 34 56 78" },
  { name: "Andorra", code: "AD", dial: "+376", placeholder: "123 456" },
  { name: "Angola", code: "AO", dial: "+244", placeholder: "912 345 678" },
  { name: "Anguilla", code: "AI", dial: "+1264", placeholder: "497 1234" },
  { name: "Antigua And Barbuda", code: "AG", dial: "+1268", placeholder: "720 1234" },
  { name: "Argentina", code: "AR", dial: "+54", placeholder: "9 11 1234-5678" },
  { name: "Armenia", code: "AM", dial: "+374", placeholder: "10 123456" },
  { name: "Aruba", code: "AW", dial: "+297", placeholder: "512 3456" },
  { name: "Australia", code: "AU", dial: "+61", placeholder: "412 345 678" },
  { name: "Austria", code: "AT", dial: "+43", placeholder: "664 1234567" },
  { name: "Azerbaijan", code: "AZ", dial: "+994", placeholder: "50 123 45 67" },
  { name: "Bahamas", code: "BS", dial: "+1242", placeholder: "321 1234" },
  { name: "Bahrain", code: "BH", dial: "+973", placeholder: "1234 5678" },
  { name: "Bangladesh", code: "BD", dial: "+880", placeholder: "1234-567890" },
  { name: "Barbados", code: "BB", dial: "+1246", placeholder: "426 1234" },
  { name: "Belarus", code: "BY", dial: "+375", placeholder: "29 123-45-67" },
  { name: "Belgium", code: "BE", dial: "+32", placeholder: "412 34 56 78" },
  { name: "Belize", code: "BZ", dial: "+501", placeholder: "223-1234" },
  { name: "Benin", code: "BJ", dial: "+229", placeholder: "90 12 34 56" },
  { name: "Bermuda", code: "BM", dial: "+1441", placeholder: "292 1234" },
  { name: "Bhutan", code: "BT", dial: "+975", placeholder: "17 12 34 56" },
  { name: "Bolivia", code: "BO", dial: "+591", placeholder: "7 1234567" },
  { name: "Bosnia And Herzegovina", code: "BA", dial: "+387", placeholder: "61 123 456" },
  { name: "Botswana", code: "BW", dial: "+267", placeholder: "71 123 456" },
  { name: "Brazil", code: "BR", dial: "+55", placeholder: "11 91234-5678" },
  { name: "British Virgin Islands", code: "VG", dial: "+1284", placeholder: "494 1234" },
  { name: "Brunei", code: "BN", dial: "+673", placeholder: "812 3456" },
  { name: "Bulgaria", code: "BG", dial: "+359", placeholder: "87 123 4567" },
  { name: "Burkina Faso", code: "BF", dial: "+226", placeholder: "70 12 34 56" },
  { name: "Burundi", code: "BI", dial: "+257", placeholder: "71 123 456" },
  { name: "Cambodia", code: "KH", dial: "+855", placeholder: "12 345 678" },
  { name: "Cameroon", code: "CM", dial: "+237", placeholder: "6 12 34 56 78" },
  { name: "Canada", code: "CA", dial: "+1", placeholder: "(416) 123-4567" },
  { name: "Cape Verde", code: "CV", dial: "+238", placeholder: "912 34 56" },
  { name: "Cayman Islands", code: "KY", dial: "+1345", placeholder: "949 1234" },
  { name: "Central African Republic", code: "CF", dial: "+236", placeholder: "70 12 34 56" },
  { name: "Chad", code: "TD", dial: "+235", placeholder: "66 12 34 56" },
  { name: "Chile", code: "CL", dial: "+56", placeholder: "9 1234 5678" },
  { name: "China", code: "CN", dial: "+86", placeholder: "131 1234 5678" },
  { name: "Colombia", code: "CO", dial: "+57", placeholder: "300 123 4567" },
  { name: "Comoros", code: "KM", dial: "+269", placeholder: "321 23 45" },
  { name: "Congo", code: "CG", dial: "+242", placeholder: "06 123 4567" },
  { name: "Cook Islands", code: "CK", dial: "+682", placeholder: "21 123" },
  { name: "Costa Rica", code: "CR", dial: "+506", placeholder: "8123 4567" },
  { name: "Croatia", code: "HR", dial: "+385", placeholder: "91 123 4567" },
  { name: "Cuba", code: "CU", dial: "+53", placeholder: "5 1234567" },
  { name: "Cyprus", code: "CY", dial: "+357", placeholder: "99 123456" },
  { name: "Czech Republic", code: "CZ", dial: "+420", placeholder: "601 123 456" },
  { name: "Denmark", code: "DK", dial: "+45", placeholder: "12 34 56 78" },
  { name: "Djibouti", code: "DJ", dial: "+253", placeholder: "77 12 34 56" },
  { name: "Dominica", code: "DM", dial: "+1767", placeholder: "275 1234" },
  { name: "Dominican Republic", code: "DO", dial: "+1809", placeholder: "809-123-4567" },
  { name: "Ecuador", code: "EC", dial: "+593", placeholder: "9 1234 5678" },
  { name: "Egypt", code: "EG", dial: "+20", placeholder: "101 234 5678" },
  { name: "El Salvador", code: "SV", dial: "+503", placeholder: "7123 4567" },
  { name: "Equatorial Guinea", code: "GQ", dial: "+240", placeholder: "222 123 456" },
  { name: "Eritrea", code: "ER", dial: "+291", placeholder: "1 123456" },
  { name: "Estonia", code: "EE", dial: "+372", placeholder: "5123 4567" },
  { name: "Ethiopia", code: "ET", dial: "+251", placeholder: "91 123 4567" },
  { name: "Falkland Islands", code: "FK", dial: "+500", placeholder: "12345" },
  { name: "Faroe Islands", code: "FO", dial: "+298", placeholder: "123456" },
  { name: "Fiji", code: "FJ", dial: "+679", placeholder: "912 3456" },
  { name: "Finland", code: "FI", dial: "+358", placeholder: "41 2345678" },
  { name: "France", code: "FR", dial: "+33", placeholder: "6 12 34 56 78" },
  { name: "French Guiana", code: "GF", dial: "+594", placeholder: "694 12 34 56" },
  { name: "French Polynesia", code: "PF", dial: "+689", placeholder: "87 12 34 56" },
  { name: "Gabon", code: "GA", dial: "+241", placeholder: "01 12 34 56" },
  { name: "Gambia", code: "GM", dial: "+220", placeholder: "912 3456" },
  { name: "Georgia", code: "GE", dial: "+995", placeholder: "512 34 56 78" },
  { name: "Germany", code: "DE", dial: "+49", placeholder: "1512 3456789" },
  { name: "Ghana", code: "GH", dial: "+233", placeholder: "24 123 4567" },
  { name: "Gibraltar", code: "GI", dial: "+350", placeholder: "51234567" },
  { name: "Greece", code: "GR", dial: "+30", placeholder: "691 234 5678" },
  { name: "Greenland", code: "GL", dial: "+299", placeholder: "12 34 56" },
  { name: "Grenada", code: "GD", dial: "+1473", placeholder: "440 1234" },
  { name: "Guadeloupe", code: "GP", dial: "+590", placeholder: "690 12 34 56" },
  { name: "Guam", code: "GU", dial: "+1671", placeholder: "646 1234" },
  { name: "Guatemala", code: "GT", dial: "+502", placeholder: "5123 4567" },
  { name: "Guinea", code: "GN", dial: "+224", placeholder: "621 23 45 67" },
  { name: "Guinea-Bissau", code: "GW", dial: "+245", placeholder: "95 123 45 67" },
  { name: "Guyana", code: "GY", dial: "+592", placeholder: "612 3456" },
  { name: "Haiti", code: "HT", dial: "+509", placeholder: "3123 4567" },
  { name: "Honduras", code: "HN", dial: "+504", placeholder: "9123-4567" },
  { name: "Hong Kong", code: "HK", dial: "+852", placeholder: "5123 4567" },
  { name: "Hungary", code: "HU", dial: "+36", placeholder: "20 123 4567" },
  { name: "Iceland", code: "IS", dial: "+354", placeholder: "123 4567" },
  { name: "India", code: "IN", dial: "+91", placeholder: "91234 56789" },
  { name: "Indonesia", code: "ID", dial: "+62", placeholder: "812-3456-7890" },
  { name: "Iran", code: "IR", dial: "+98", placeholder: "912 345 6789" },
  { name: "Iraq", code: "IQ", dial: "+964", placeholder: "790 123 4567" },
  { name: "Ireland", code: "IE", dial: "+353", placeholder: "83 123 4567" },
  { name: "Israel", code: "IL", dial: "+972", placeholder: "51-234-5678" },
  { name: "Italy", code: "IT", dial: "+39", placeholder: "312 345 6789" },
  { name: "Jamaica", code: "JM", dial: "+1876", placeholder: "912 3456" },
  { name: "Japan", code: "JP", dial: "+81", placeholder: "90-1234-5678" },
  { name: "Jordan", code: "JO", dial: "+962", placeholder: "7 9123 4567" },
  { name: "Kazakhstan", code: "KZ", dial: "+7", placeholder: "712 345 6789" },
  { name: "Kenya", code: "KE", dial: "+254", placeholder: "712 345678" },
  { name: "Kuwait", code: "KW", dial: "+965", placeholder: "1234 5678" },
  { name: "Kyrgyzstan", code: "KG", dial: "+996", placeholder: "551 234 567" },
  { name: "Laos", code: "LA", dial: "+856", placeholder: "20 12 345 678" },
  { name: "Latvia", code: "LV", dial: "+371", placeholder: "21 234 567" },
  { name: "Lebanon", code: "LB", dial: "+961", placeholder: "03 123 456" },
  { name: "Lesotho", code: "LS", dial: "+266", placeholder: "5123 4567" },
  { name: "Liberia", code: "LR", dial: "+231", placeholder: "88 123 4567" },
  { name: "Libya", code: "LY", dial: "+218", placeholder: "91 123 4567" },
  { name: "Liechtenstein", code: "LI", dial: "+423", placeholder: "123 45 67" },
  { name: "Lithuania", code: "LT", dial: "+370", placeholder: "612 34 567" },
  { name: "Luxembourg", code: "LU", dial: "+352", placeholder: "621 123 456" },
  { name: "Macau", code: "MO", dial: "+853", placeholder: "6123 4567" },
  { name: "Macedonia", code: "MK", dial: "+389", placeholder: "71 234 567" },
  { name: "Madagascar", code: "MG", dial: "+261", placeholder: "32 12 345 67" },
  { name: "Malawi", code: "MW", dial: "+265", placeholder: "888 12 34 56" },
  { name: "Malaysia", code: "MY", dial: "+60", placeholder: "12-345 6789" },
  { name: "Maldives", code: "MV", dial: "+960", placeholder: "712 3456" },
  { name: "Mali", code: "ML", dial: "+223", placeholder: "71 23 45 67" },
  { name: "Malta", code: "MT", dial: "+356", placeholder: "9123 4567" },
  { name: "Marshall Islands", code: "MH", dial: "+692", placeholder: "235 1234" },
  { name: "Mauritania", code: "MR", dial: "+222", placeholder: "31 23 45 67" },
  { name: "Mauritius", code: "MU", dial: "+230", placeholder: "5123 4567" },
  { name: "Mayotte", code: "YT", dial: "+262", placeholder: "639 12 34 56" },
  { name: "Mexico", code: "MX", dial: "+52", placeholder: "55 1234 5678" },
  { name: "Micronesia", code: "FM", dial: "+691", placeholder: "320 1234" },
  { name: "Moldova", code: "MD", dial: "+373", placeholder: "612 34 567" },
  { name: "Monaco", code: "MC", dial: "+377", placeholder: "6 12 34 56 78" },
  { name: "Mongolia", code: "MN", dial: "+976", placeholder: "9123 4567" },
  { name: "Montenegro", code: "ME", dial: "+382", placeholder: "67 123 456" },
  { name: "Montserrat", code: "MS", dial: "+1664", placeholder: "491 1234" },
  { name: "Morocco", code: "MA", dial: "+212", placeholder: "612 345678" },
  { name: "Mozambique", code: "MZ", dial: "+258", placeholder: "82 123 4567" },
  { name: "Myanmar", code: "MM", dial: "+95", placeholder: "9 123 45678" },
  { name: "Namibia", code: "NA", dial: "+264", placeholder: "81 123 4567" },
  { name: "Nauru", code: "NR", dial: "+674", placeholder: "555 1234" },
  { name: "Nepal", code: "NP", dial: "+977", placeholder: "981-2345678" },
  { name: "Netherlands", code: "NL", dial: "+31", placeholder: "6 12345678" },
  { name: "New Caledonia", code: "NC", dial: "+687", placeholder: "12.34.56" },
  { name: "New Zealand", code: "NZ", dial: "+64", placeholder: "21 123 4567" },
  { name: "Nicaragua", code: "NI", dial: "+505", placeholder: "8123 4567" },
  { name: "Niger", code: "NE", dial: "+227", placeholder: "91 23 45 67" },
  { name: "Nigeria", code: "NG", dial: "+234", placeholder: "803 123 4567" },
  { name: "Niue", code: "NU", dial: "+683", placeholder: "1234" },
  { name: "North Korea", code: "KP", dial: "+850", placeholder: "191 123 4567" },
  { name: "Norway", code: "NO", dial: "+47", placeholder: "912 34 567" },
  { name: "Oman", code: "OM", dial: "+968", placeholder: "9123 4567" },
  { name: "Pakistan", code: "PK", dial: "+92", placeholder: "312 3456789" },
  { name: "Palau", code: "PW", dial: "+680", placeholder: "775 1234" },
  { name: "Palestine", code: "PS", dial: "+970", placeholder: "599 123 456" },
  { name: "Panama", code: "PA", dial: "+507", placeholder: "6123-4567" },
  { name: "Papua New Guinea", code: "PG", dial: "+675", placeholder: "7123 4567" },
  { name: "Paraguay", code: "PY", dial: "+595", placeholder: "912 345678" },
  { name: "Peru", code: "PE", dial: "+51", placeholder: "912 345 678" },
  { name: "Philippines", code: "PH", dial: "+63", placeholder: "912 345 6789" },
  { name: "Poland", code: "PL", dial: "+48", placeholder: "512 345 678" },
  { name: "Portugal", code: "PT", dial: "+351", placeholder: "912 345 678" },
  { name: "Puerto Rico", code: "PR", dial: "+1787", placeholder: "787-123-4567" },
  { name: "Qatar", code: "QA", dial: "+974", placeholder: "3123 4567" },
  { name: "Romania", code: "RO", dial: "+40", placeholder: "712 345 678" },
  { name: "Russia", code: "RU", dial: "+7", placeholder: "912 345-67-89" },
  { name: "Rwanda", code: "RW", dial: "+250", placeholder: "712 345 678" },
  { name: "Saint Kitts And Nevis", code: "KN", dial: "+1869", placeholder: "662 1234" },
  { name: "Saint Lucia", code: "LC", dial: "+1758", placeholder: "450 1234" },
  { name: "Saint Vincent And The Grenadines", code: "VC", dial: "+1784", placeholder: "457 1234" },
  { name: "Samoa", code: "WS", dial: "+685", placeholder: "71 23456" },
  { name: "San Marino", code: "SM", dial: "+378", placeholder: "0549 123456" },
  { name: "Sao Tome And Principe", code: "ST", dial: "+239", placeholder: "91 23456" },
  { name: "Saudi Arabia", code: "SA", dial: "+966", placeholder: "51 234 5678" },
  { name: "Senegal", code: "SN", dial: "+221", placeholder: "70 123 45 67" },
  { name: "Serbia", code: "RS", dial: "+381", placeholder: "61 1234567" },
  { name: "Seychelles", code: "SC", dial: "+248", placeholder: "2 123 456" },
  { name: "Sierra Leone", code: "SL", dial: "+232", placeholder: "76 123456" },
  { name: "Singapore", code: "SG", dial: "+65", placeholder: "8123 4567" },
  { name: "Slovakia", code: "SK", dial: "+421", placeholder: "912 345 678" },
  { name: "Slovenia", code: "SI", dial: "+386", placeholder: "41 123 456" },
  { name: "Solomon Islands", code: "SB", dial: "+677", placeholder: "74 12345" },
  { name: "Somalia", code: "SO", dial: "+252", placeholder: "61 1234567" },
  { name: "South Africa", code: "ZA", dial: "+27", placeholder: "71 234 5678" },
  { name: "South Korea", code: "KR", dial: "+82", placeholder: "10-1234-5678" },
  { name: "South Sudan", code: "SS", dial: "+211", placeholder: "912 345 678" },
  { name: "Spain", code: "ES", dial: "+34", placeholder: "612 34 56 78" },
  { name: "Sri Lanka", code: "LK", dial: "+94", placeholder: "71 234 5678" },
  { name: "Sudan", code: "SD", dial: "+249", placeholder: "91 234 5678" },
  { name: "Suriname", code: "SR", dial: "+597", placeholder: "812 3456" },
  { name: "Swaziland", code: "SZ", dial: "+268", placeholder: "7612 3456" },
  { name: "Sweden", code: "SE", dial: "+46", placeholder: "71-234 56 78" },
  { name: "Switzerland", code: "CH", dial: "+41", placeholder: "71 123 45 67" },
  { name: "Syria", code: "SY", dial: "+963", placeholder: "912 345 678" },
  { name: "Taiwan", code: "TW", dial: "+886", placeholder: "912 345 678" },
  { name: "Tajikistan", code: "TJ", dial: "+992", placeholder: "91 234 5678" },
  { name: "Tanzania", code: "TZ", dial: "+255", placeholder: "612 345 678" },
  { name: "Thailand", code: "TH", dial: "+66", placeholder: "81 234 5678" },
  { name: "Timor-Leste", code: "TL", dial: "+670", placeholder: "771 23456" },
  { name: "Togo", code: "TG", dial: "+228", placeholder: "90 12 34 56" },
  { name: "Tokelau", code: "TK", dial: "+690", placeholder: "1234" },
  { name: "Tonga", code: "TO", dial: "+676", placeholder: "71 234" },
  { name: "Trinidad And Tobago", code: "TT", dial: "+1868", placeholder: "621 1234" },
  { name: "Tunisia", code: "TN", dial: "+216", placeholder: "91 234 567" },
  { name: "Turkey", code: "TR", dial: "+90", placeholder: "512 345 67 89" },
  { name: "Turkmenistan", code: "TM", dial: "+993", placeholder: "61 23 45 67" },
  { name: "Turks And Caicos Islands", code: "TC", dial: "+1649", placeholder: "231 1234" },
  { name: "Tuvalu", code: "TV", dial: "+688", placeholder: "20 123" },
  { name: "Uganda", code: "UG", dial: "+256", placeholder: "712 345678" },
  { name: "Ukraine", code: "UA", dial: "+380", placeholder: "63 123 4567" },
  { name: "United Arab Emirates", code: "AE", dial: "+971", placeholder: "50 123 4567" },
  { name: "United Kingdom", code: "GB", dial: "+44", placeholder: "7123 456789" },
  { name: "United States", code: "US", dial: "+1", placeholder: "(407) 231-1234" },
  { name: "Uruguay", code: "UY", dial: "+598", placeholder: "91 234 567" },
  { name: "Uzbekistan", code: "UZ", dial: "+998", placeholder: "91 234 56 78" },
  { name: "Vanuatu", code: "VU", dial: "+678", placeholder: "71 23456" },
  { name: "Venezuela", code: "VE", dial: "+58", placeholder: "412 123 4567" },
  { name: "Vietnam", code: "VN", dial: "+84", placeholder: "912 345 678" },
  { name: "Wallis And Futuna", code: "WF", dial: "+681", placeholder: "72 1234" },
  { name: "Yemen", code: "YE", dial: "+967", placeholder: "71 234 567" },
  { name: "Zambia", code: "ZM", dial: "+260", placeholder: "95 123 4567" },
  { name: "Zimbabwe", code: "ZW", dial: "+263", placeholder: "71 234 5678" },
];

const CountrySelector = ({ value, onChange, isDark }: { value: string, onChange: (val: any) => void, isDark: boolean }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = countries.find(c => c.code === value) || countries.find(c => c.code === "US") || countries[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn("absolute left-0 top-0 bottom-0 z-10 flex items-center px-3 gap-2 border-r transition-colors rounded-l",
          isDark ? "border-slate-600 bg-slate-800/50 hover:bg-slate-800" : "border-slate-300 bg-slate-50 hover:bg-slate-100")}>
          <img src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`} alt={selected.code} className="w-5 h-auto shadow-sm" />
          <span className={cn("text-[11px] font-bold", isDark ? "text-white" : "text-slate-900")}>{selected.dial}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start" sideOffset={4}>
        <Command className={cn(isDark ? "bg-[#1e293b] text-white" : "bg-white")}>
          <CommandInput placeholder={t("common.search")} className="h-10 text-[12px]" />
          <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <CommandEmpty className="text-[12px] p-4 text-center">{t("agency.settings.general.phoneModal.noCountries")}.</CommandEmpty>
            <CommandGroup>
              {countries.reduce((acc: any[], country, idx) => {
                const firstLetter = country.name[0].toUpperCase();
                const prevLetter = idx > 0 ? countries[idx - 1].name[0].toUpperCase() : "";
                
                if (firstLetter !== prevLetter) {
                  acc.push(
                    <div key={`header-${firstLetter}`} className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                      {firstLetter}
                    </div>
                  );
                }
                
                acc.push(
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    onSelect={() => {
                      onChange(country);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <img src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} alt={country.code} className="w-5 h-auto shadow-sm" />
                    <span className="text-[12px] font-medium flex-1">{country.name}</span>
                    <span className="text-[12px] font-bold text-slate-400">({country.dial})</span>
                    {selected.code === country.code && <Check className="w-3 h-3 text-green-500" />}
                  </CommandItem>
                );
                return acc;
              }, [])}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


interface AddAgentFormProps {
  onCancel: () => void;
}

const AddAgentForm: React.FC<AddAgentFormProps> = ({ onCancel }) => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const agencyId = userInfo.modelable_id || "7";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "agent",
    phone: "",
    phone_country: "US",
    whatsapp: "",
    whatsapp_country: "US",
    language: "en",
    tfa_required: false,
    premium_access: false
  });

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumTermsAccepted, setPremiumTermsAccepted] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const targetCode = "85651"; // This would normally be random

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", `/api/agencies/${agencyId}/members`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/agencies/${agencyId}/members`] });
      toast({ title: t("agency.agents.form.added"), description: t("agency.agents.form.added_desc") });
      onCancel();
    },
    onError: (err: any) => {
      toast({ title: t("common.error"), description: t("agency.agents.form.save_error"), variant: "destructive" });
    }
  });

  const handleSubmit = () => {
    if (!formData.first_name || !formData.email) {
      toast({ title: t("common.error"), description: t("agency.agents.form.required_fields"), variant: "destructive" });
      return;
    }
    createMutation.mutate({
      ...formData,
      password: "EzconnDefaultPassword123!" 
    });
  };


  return (
    <div className={cn("p-6 font-sans transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
      <div className={cn("w-full shadow-sm border rounded-lg overflow-hidden transition-colors",
        isDark ? "bg-[#1e293b] border-slate-600" : "bg-white border-slate-300")}>
        
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className={cn("mt-1 transition-colors")}>
              <Users className={cn("w-5 h-5", isDark ? "text-slate-200" : "text-slate-900")} />
            </div>
            <div>
              <h1 className={cn("text-[14px] font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.add_title")}</h1>
              <p className={cn("text-[11px] font-bold mt-0.5", isDark ? "text-slate-300" : "text-slate-800")}>
                {t("agency.agents.form.add_desc")}.
              </p>
            </div>
          </div>

          <div className="my-6 border-t border-slate-300 dark:border-slate-700" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            {/* Left Column */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.first_name")}</label>
                <Input 
                  className={cn("h-9 rounded border-slate-200 text-[12px] font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-green-500", 
                    isDark ? "bg-[#0f172a] border-slate-700" : "bg-white")} 
                  placeholder={t("agency.agents.form.first_name")} 
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.last_name")}</label>
                <Input 
                  className={cn("h-9 rounded border-slate-200 text-[12px] font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-green-500", 
                    isDark ? "bg-[#0f172a] border-slate-700" : "bg-white")} 
                  placeholder={t("agency.agents.form.last_name")} 
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.email")}</label>
                <Input 
                  className={cn("h-9 rounded border-slate-200 text-[12px] font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-green-500", 
                    isDark ? "bg-[#0f172a] border-slate-700" : "bg-white")} 
                  placeholder={t("agency.agents.form.email")} 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.role")}</label>
                <Select onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger className={cn("h-9 rounded border-slate-200 text-[12px] font-medium focus:ring-1 focus:ring-green-500", 
                    isDark ? "bg-[#0f172a] border-slate-700" : "bg-white")}>
                    <SelectValue placeholder={t("agency.agents.form.select_role")} />
                  </SelectTrigger>
                  <SelectContent className={cn("border-slate-200 shadow-xl", isDark ? "bg-[#1e293b] border-slate-700" : "bg-white")}>
                    <SelectItem value="super_user" className="text-[12px] font-medium">{t("agency.agents.roles.super_user")}</SelectItem>
                    <SelectItem value="can_edit_role" className="text-[12px] font-medium">{t("canEditRole")}</SelectItem>
                    <SelectItem value="new_role" className="text-[12px] font-medium">{t("new role")}</SelectItem>
                    <SelectItem value="co_owner" className="text-[12px] font-medium">{t("agency.agents.roles.co_owner")}</SelectItem>
                    <SelectItem value="bug_check" className="text-[12px] font-medium">{t("Bug check")}</SelectItem>
                    <SelectItem value="ahmed" className="text-[12px] font-medium">{t("ahmed")}</SelectItem>
                    <SelectItem value="testing" className="text-[12px] font-medium">{t("testing")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.settings.general.phone")}</label>
                <div className="relative group">
                  <CountrySelector 
                    isDark={isDark} 
                    value={formData.phone_country} 
                    onChange={(c) => setFormData({ ...formData, phone_country: c.code })} 
                  />
                  <Input 
                    className={cn("pl-20 h-9 rounded border-slate-300 text-[12px] font-bold placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-green-500", 
                      isDark ? "bg-[#0f172a] border-slate-600" : "bg-white")} 
                    placeholder={countries.find(c => c.code === formData.phone_country)?.placeholder || "(407) 231-1234"} 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.whatsapp")}</label>
                <div className="relative group">
                  <CountrySelector 
                    isDark={isDark} 
                    value={formData.whatsapp_country} 
                    onChange={(c) => setFormData({ ...formData, whatsapp_country: c.code })} 
                  />
                  <Input 
                    className={cn("pl-20 h-9 rounded border-slate-300 text-[12px] font-bold placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-green-500", 
                      isDark ? "bg-[#0f172a] border-slate-600" : "bg-white")} 
                    placeholder={countries.find(c => c.code === formData.whatsapp_country)?.placeholder || "(407) 231-1234"} 
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.language")}</label>
                <Select onValueChange={(val) => setFormData({...formData, language: val})}>
                  <SelectTrigger className={cn("h-9 rounded border-slate-200 text-[12px] font-medium focus:ring-1 focus:ring-green-500", 
                    isDark ? "bg-[#0f172a] border-slate-700" : "bg-white")}>
                    <SelectValue placeholder={t("agency.agents.form.select_language")} />
                  </SelectTrigger>
                  <SelectContent className={cn("border-slate-200 shadow-xl", isDark ? "bg-[#1e293b] border-slate-700" : "bg-white")}>
                    <SelectItem value="en" className="text-[12px] font-medium">{t("common.languages.en")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="my-10 border-t border-slate-300 dark:border-slate-700" />

          {/* 2-Factor Auth Section */}
          <div className="space-y-4">
            <h3 className={cn("text-[13px] font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.tfa_title")}</h3>
            <div className="flex items-start gap-4">
              <Switch className="mt-0.5 data-[state=checked]:bg-green-500 scale-[0.8] origin-left border border-slate-300 dark:border-slate-600" checked={formData.tfa_required} onCheckedChange={(val) => setFormData({...formData, tfa_required: val})} />
              <div className="-ml-2">
                <p className={cn("text-[12px] font-bold", isDark ? "text-slate-200" : "text-slate-900")}>{t("agency.agents.form.tfa_label")}</p>
                <p className={cn("text-[11px] mt-0.5 font-bold leading-relaxed", isDark ? "text-slate-400" : "text-slate-800")}>
                  {t("agency.agents.form.tfa_desc")}.
                </p>
              </div>
            </div>
          </div>

          <div className="my-10 border-t border-slate-300 dark:border-slate-700" />

          {/* Premium Support Modal */}
          {showPremiumModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className={cn("w-full max-w-[440px] rounded-2xl shadow-2xl p-10 animate-in fade-in zoom-in duration-200", 
                isDark ? "bg-[#1e293b] border border-slate-700" : "bg-white border border-slate-400")}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    <AlertTriangle className="w-12 h-12 text-[#ff9900]" />
                  </div>
                  <h2 className={cn("text-[16px] font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.premium.modal_title")}</h2>
                  
                  <p className={cn("text-[11px] font-bold leading-relaxed mb-8", isDark ? "text-slate-400" : "text-slate-600")}>
                    {t("agency.agents.form.premium.modal_desc")}.
                  </p>

                  <div className="flex items-baseline gap-2 mb-10">
                    <span className={cn("text-[16px] font-bold", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.premium.cost_today")}</span>
                    <span className={cn("text-[20px] font-bold", isDark ? "text-white" : "text-slate-900")}>$2.49</span>
                    <span className={cn("text-[12px] font-bold text-slate-500")}>{t("agency.agents.form.premium.monthly_cost")}</span>
                  </div>

                  <div className="w-full space-y-6">
                    <div className="flex items-start gap-3 text-left">
                      <input 
                        type="checkbox" 
                        id="premium-terms"
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-green-500 focus:ring-green-500 cursor-pointer" 
                        checked={premiumTermsAccepted}
                        onChange={(e) => setPremiumTermsAccepted(e.target.checked)}
                      />
                      <label htmlFor="premium-terms" className={cn("text-[11px] font-bold leading-relaxed cursor-pointer", isDark ? "text-slate-300" : "text-slate-700")}>
                        {t("agency.agents.form.premium.terms")}.
                      </label>
                    </div>

                    <div className="space-y-2 text-left">
                      <p className={cn("text-[11px] font-bold", isDark ? "text-slate-300" : "text-slate-800")}>
                        {t("agency.agents.form.premium.enter_code")} <span className="text-slate-900 dark:text-white font-black">{targetCode}</span> {t("agency.agents.form.premium.to_continue")}.
                      </p>
                      <Input 
                        placeholder={t("agency.agents.form.premium.code_placeholder")} 
                        className={cn("h-10 text-[12px] font-bold", isDark ? "bg-[#0f172a] border-slate-700" : "bg-white border-slate-200")}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button 
                        onClick={() => {
                          setShowPremiumModal(false);
                          setFormData({ ...formData, premium_access: false });
                        }}
                        className={cn("flex-1 h-9 rounded text-[12px] font-bold transition-colors border", 
                          isDark ? "bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")}>
                        {t("common.cancel")}
                      </button>
                      <button 
                        disabled={!premiumTermsAccepted || verificationCode !== targetCode}
                        onClick={() => {
                          setShowPremiumModal(false);
                          setFormData({ ...formData, premium_access: true });
                        }}
                        className={cn("flex-1 h-9 rounded text-[12px] font-bold transition-colors shadow-sm", 
                          premiumTermsAccepted && verificationCode === targetCode 
                            ? "bg-[#ef4444] hover:bg-red-600 text-white" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
                        {t("common.agree")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="my-8 border-t border-slate-100 dark:border-slate-800" />

          {/* Premium Support Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div className="space-y-5">
              <h3 className={cn("text-[13px] font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.premium.title")}</h3>
              <div className="flex items-center gap-4">
                <Switch 
                  className="data-[state=checked]:bg-green-500 scale-[0.8] origin-left" 
                  checked={formData.premium_access}
                  onCheckedChange={(val) => {
                    if (val) {
                      setShowPremiumModal(true);
                    } else {
                      setFormData({ ...formData, premium_access: false });
                    }
                  }}
                />
                <div className="flex items-center gap-1.5 -ml-2">
                  <p className={cn("text-[12px] font-bold", isDark ? "text-slate-200" : "text-slate-900")}>{t("agency.agents.form.premium.label")}</p>
                  <Info size={14} className="text-slate-300 cursor-pointer" />
                </div>
              </div>

              {/* Warning Alert */}
              <div className={cn(
                "p-4 rounded-lg border",
                isDark ? "bg-yellow-900/10 border-yellow-900/30" : "bg-[#fffef2] border-[#fff799] shadow-sm"
              )}>
                <div className="flex gap-3">
                  <AlertTriangle className={cn("w-4 h-4 shrink-0 mt-0.5", isDark ? "text-yellow-500" : "text-[#ff9900]")} />
                  <div className="text-[11px] leading-relaxed">
                    <p className={cn("font-bold mb-0.5", isDark ? "text-yellow-500" : "text-[#8a6d3b]")}>
                      {t("agency.agents.form.premium.subscribed_count", { count: 0 })}.
                    </p>
                    <p className={cn("font-medium", isDark ? "text-yellow-500/80" : "text-[#8a6d3b] opacity-80")}>
                      {t("agency.agents.form.premium.plan_details")}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6 md:mt-0">
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.premium.email")}</label>
                <Input className={cn("h-9 rounded border-slate-300 text-[12px] font-bold placeholder:text-slate-500", isDark ? "bg-[#0f172a] border-slate-600" : "bg-white")} placeholder="a@b.com" />
              </div>
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.premium.phone")}</label>
                <div className="relative group">
                  <CountrySelector 
                    isDark={isDark} 
                    value={formData.phone_country} 
                    onChange={(c) => setFormData({ ...formData, phone_country: c.code })} 
                  />
                  <Input 
                    className={cn("pl-20 h-9 rounded border-slate-300 text-[12px] font-bold placeholder:text-slate-500", isDark ? "bg-[#0f172a] border-slate-600" : "bg-white")} 
                    placeholder={countries.find(c => c.code === formData.phone_country)?.placeholder || "(407) 231-1234"} 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={cn("text-[11px] font-bold uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>{t("agency.agents.form.premium.whatsapp")}</label>
                <div className="relative group">
                  <CountrySelector 
                    isDark={isDark} 
                    value={formData.whatsapp_country} 
                    onChange={(c) => setFormData({ ...formData, whatsapp_country: c.code })} 
                  />
                  <Input 
                    className={cn("pl-20 h-9 rounded border-slate-300 text-[12px] font-bold placeholder:text-slate-400", isDark ? "bg-[#0f172a] border-slate-600" : "bg-white")} 
                    placeholder={countries.find(c => c.code === formData.whatsapp_country)?.placeholder || "(407) 231-1234"} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-12 pt-6 border-t border-slate-300 dark:border-slate-700">
            <button 
              onClick={onCancel} 
              className={cn("px-5 h-8 rounded text-[11px] font-bold transition-all border", 
                isDark ? "bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800" : "bg-white border-slate-400 text-slate-800 hover:bg-slate-50")}>
              {t("common.cancel")}
            </button>
            <button 
              className="bg-[#00e55e] hover:bg-[#00d056] text-white px-7 h-8 rounded text-[11px] font-bold shadow-sm transition-all active:scale-95 border border-[#00e55e]"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAgentForm;
