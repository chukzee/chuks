package com.beepmemobile.www.ui.signup

import android.app.AlertDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.AuthState
import com.beepmemobile.www.databinding.SignUpPhoneNumberVerificationFragmentBinding
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.util.Constants
import com.beepmemobile.www.util.Util


class SignUpPhoneNumberVerificationFragment : Fragment() {
    private val model: SignUpPhoneNumberVerificationViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }

    private var _binding: SignUpPhoneNumberVerificationFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding

    companion object {
        fun newInstance() = SignUpPhoneNumberVerificationFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpPhoneNumberVerificationFragmentBinding.inflate(inflater, container, false)
        val view = binding?.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        var selected_country = ""
		var ccp = binding?.signUpPhoneNumberVerificationSpnCountry

        binding?.signUpPhoneNumberVerificationLblZipCode?.text?.append("${ccp?.selectedCountryCodeWithPlus}")

        ccp?.setOnCountryChangeListener {
            binding?.signUpPhoneNumberVerificationLblZipCode?.text?.clear()
            binding?.signUpPhoneNumberVerificationLblZipCode?.text?.append("${ccp.selectedCountryCodeWithPlus}")
        }

        var user_id = ""

        binding?.signUpPhoneNumberVerificationBtnNext?.setOnClickListener {



            var phone_no = binding?.signUpPhoneNumberVerificationTxtPhoneNo?.text.toString()
            var country = ccp?.selectedCountryName
            var country_code = ccp?.selectedCountryNameCode
            var dialling_code = "${ccp?.selectedCountryCodeAsInt}"
            var phoneNo =
                country_code?.let { it1 -> Util.reformPhoneNumber(requireContext(), phone_no, it1) }

            AlertDialog.Builder(this.requireContext())//TODO TO BE REMOVED ABEG O!!!
                .setTitle("Something")
                .setMessage("country_code: ${Util.countryNameCode(requireContext())}," +
                        " dialling_code: ${Util.countryNumericCode(requireContext(), Util.countryNameCode(requireContext()))}," +
                        " nomarlize phone number:  ${Util.reformPhoneNumber(
                            requireContext(),
                            phone_no,
                            Util.countryNameCode(requireContext())
                        )}")
                .create()
                .show()

             // display the dialling code

            user_id = (phoneNo?.numberE164?:""

            var req = mapOf<String, String>("user_id" to user_id),
                "mobile_phone_no" to (phoneNo?.nationNumber?:""),
                "dialling_code" to dialling_code,
                "country_code" to (country_code?:""),
                "country" to (country?:""))

            authModel.singupStage(req, AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY)
        }

        binding?.signUpPhoneNumberVerificationBtnBack?.setOnClickListener {
            //TODO go back
        }
		
		val observer = Observer<AppUser> { app_user ->
		
			if(app_user.auth_state == AuthState.AUTH_STAGE_CONFIRM_VERIFICATION_CODE){

                val direction =
                            SignUpPhoneNumberVerificationFragmentDirections.moveToSignUpConfirmVerificationCodeFragment()

                val bundle = bundleOf(
                    Constants.USER_ID to user_id
                )

				navController.navigate(direction, bundle)
            }
		
		}
		
		// Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)

        super.onViewCreated(view, savedInstanceState)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

    }

}
