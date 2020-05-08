package com.beepmemobile.www.ui.signup

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.Toast
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController

import com.beepmemobile.www.databinding.SignUpProfilePhotoFragmentBinding
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.ui.main.MainViewModel

class SignUpProfilePhotoFragment : Fragment() {
    private val model: SignUpProfilePhotoViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }

    private var _binding: SignUpProfilePhotoFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SignUpProfilePhotoFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpProfilePhotoFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        Toast.makeText(this.context, "1 - inside onViewCreated of SignUpProfilePhotoFragment", Toast.LENGTH_LONG).show()

        binding.signUpProfilePhotoBtnNext.setOnClickListener {

            var profileImag = binding.signUpProfilePhotoImgPhoto
            var profile_photo = imageDataToBase64(profileImag)

            var req = mapOf<String, String>("profile_photo" to profile_photo)

            authModel.singupStage(req, AuthState.AUTH_STAGE_PROFILE_PHOTO)
        }

        binding.signUpProfilePhotoBtnBack.setOnClickListener {
            //TODO go back
        }
		
		val observer = Observer<AppUser> { app_user ->
		
			if(app_user.auth_state == AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY){

                        Toast.makeText(
                            this.context,
                            "AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY",
                            Toast.LENGTH_LONG
                        ).show()

                val direction =
                            SignUpProfilePhotoFragmentDirections.moveToSignUpPhoneNumberVerificationFragment()
				navController.navigate(direction)
            }
		
		}
		
		// Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)


        Toast.makeText(this.context, "2 - inside onViewCreated of SignUpProfilePhotoFragment", Toast.LENGTH_LONG).show()

        super.onViewCreated(view, savedInstanceState)
    }

    private fun imageDataToBase64(img_view: ImageView): String {

        //TODO convert image data to base64 string so as to be consistent with data type
        //of other signup data and to be able to post it in JSON format

        return ""
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
